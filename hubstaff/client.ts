import { jwtDecode } from 'jwt-decode';
import { z } from 'zod';
import _ from 'lodash';
import { URLSearchParams } from 'url';
import { differenceInDays } from 'date-fns';

import { type HubstaffAccess } from '@prisma/client';

import {
  type HubstaffActivity,
  type HubstaffProject,
  activitySchema,
  paginationSchema,
  projectSchema,
  userSchema,
} from '@/hubstaff/validators';

import { prisma } from '@/lib/db';

const BASE_URL = 'https://api.hubstaff.com/v2';

const ORG_ID = process.env.ORGANIZATION_ID || '';
const PAGE_LIMIT = 500;

export default class HubstaffClient {
  private access: Partial<HubstaffAccess>;

  constructor() {
    this.access = {
      refreshToken: process.env.REFRESH_TOKEN || '',
    };
  }

  private async refreshToken() {
    if (!this.access.refreshToken) throw new Error('Refresh token is missing!');

    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: this.access.refreshToken,
    });

    const res = await fetch(
      `https://account.hubstaff.com/access_tokens?${params.toString()}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      },
    );

    const access = z
      .object({
        access_token: z.string(),
        refresh_token: z.string(),
      })
      .transform((v) => ({
        accessToken: v.access_token,
        refreshToken: v.refresh_token,
      }))
      .parse(await res.json());

    const { exp } = z
      .object({ exp: z.number() })
      .parse(jwtDecode(access.accessToken));

    this.access = await prisma.hubstaffAccess.update({
      where: { id: this.access.id },
      data: { ...access, exp },
    });
  }

  private async maybeRefreshToken() {
    // Get token from database if needed
    if (!this.access.accessToken) {
      // We assume only one hubstaffAccess will ever exist in DB. Maybe in future we will have more?
      this.access = await prisma.hubstaffAccess.findFirstOrThrow().catch(() => {
        // console.log('HubstaffAccess does not exist in DB, creating new one');
        return prisma.hubstaffAccess.create({
          data: {
            accessToken: process.env.ACCESS_TOKEN || '',
            refreshToken: process.env.REFRESH_TOKEN || '',
          },
        });
      });
    }

    if ((this.access.exp || 0) < Date.now() / 1000) {
      await this.refreshToken();
    }
  }

  private async request(
    endpoint: string,
    options: Parameters<typeof fetch>[1] = {}, // This type is needed to be able to pass custom cache & revalidate options
  ) {
    await this.maybeRefreshToken();

    if (!this.access.accessToken)
      throw new Error('accessToken missing - something is wrong');

    const res = await fetch(`${BASE_URL}/${_.trimStart(endpoint, '/')}`, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.access.accessToken || ''}`,
      },
      ...(options.body && { ...{ body: JSON.stringify(options.body) } }),
      ...options,
    });

    return res.json();
  }

  private async get(endpoint: string, options: Parameters<typeof fetch>[1]) {
    return this.request(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  // https://developer.hubstaff.com/docs/hubstaff_v2#!/projects/getV2ProjectsProjectId
  async getProject(id: number) {
    const { project } = z
      .object({
        project: projectSchema,
      })
      .parse(
        await this.get(`projects/${id}`, {
          next: { revalidate: 60 },
        }),
      );

    return project;
  }

  // https://developer.hubstaff.com/docs/hubstaff_v2#!/projects/getV2OrganizationsOrganizationIdProjects
  async getProjects(pageId?: number): Promise<HubstaffProject[]> {
    const params = new URLSearchParams({
      page_limit: PAGE_LIMIT.toString(),
      page_start_id: pageId?.toString() || '',
    });

    const { projects, pagination } = z
      .object({
        projects: projectSchema.array(),
        pagination: paginationSchema,
      })
      .parse(
        await this.request(
          `/organizations/${ORG_ID}/projects?${params.toString()}`,
          { next: { revalidate: 3600 } },
        ),
      );

    const nextPageProjects = pagination?.next_page_start_id
      ? await this.getProjects(pagination.next_page_start_id)
      : [];

    return [...projects, ...nextPageProjects];
  }

  // https://developer.hubstaff.com/docs/hubstaff_v2#!/users/getV2UsersUserId
  async getUser(id: number) {
    const { user } = z
      .object({
        user: userSchema,
      })
      .parse(
        await this.get(`users/${id}`, {
          next: { revalidate: 3600 },
        }),
      );

    return user;
  }

  // https://developer.hubstaff.com/docs/hubstaff_v2#!/organizations/getV2OrganizationsOrganizationIdMembers
  async getOrganizationMembers() {
    const params = new URLSearchParams({ page_limit: PAGE_LIMIT.toString() });

    const { members } = z
      .object({
        members: z.object({ user_id: z.number() }).array(),
      })
      .parse(
        await this.request(
          `/organizations/${ORG_ID}/members?${params.toString()}`,
          { next: { revalidate: 3600 } },
        ),
      );

    return Promise.all(members.map((member) => this.getUser(member.user_id)));
  }

  // TODO: add more filters that API supports
  async getActivities(
    startTime: Date,
    stopTime: Date,
    pageId?: number,
    hubstaffProjectId?: number,
  ): Promise<HubstaffActivity[]> {
    // Hubstaff doesn't allow to fetch more than 1 week in 1 request.
    if (differenceInDays(stopTime, startTime) > 7) {
      // Break our interval [startTime, stopTime] into
      // multiple sub-intervals, each of them is 1 week max
      const points = [
        ..._.range(
          startTime.getTime(),
          stopTime.getTime(),
          1000 * 60 * 60 * 24 * 7, // 1 week in milliseconds
        ).map((ms) => new Date(ms)),
        stopTime, // End of the range was not included
      ];

      const intervals = _.zip(points, points.slice(1)).slice(0, -1);

      const results = await Promise.all(
        intervals.map((interval) => {
          if (!interval[0] || !interval[1])
            throw new Error(`Wrong interval: ${JSON.stringify(interval)}`);

          return this.getActivities(interval[0], interval[1]);
        }),
      );

      return _.flatten(results);
    }

    const params = new URLSearchParams({
      page_limit: PAGE_LIMIT.toString(),
      page_start_id: pageId?.toString() || '',
      'time_slot[start]': startTime.toISOString(),
      'time_slot[stop]': stopTime.toISOString(),
    });

    // console.log('Fetching dates ', startTime, stopTime, pageId);

    // 1. projects/{proj_id}/activities => https://developer.hubstaff.com/docs/hubstaff_v2#!/activities/getV2ProjectsProjectIdActivities
    // 2. organizations/{org_id}/activities => https://developer.hubstaff.com/docs/hubstaff_v2#!/activities/getV2OrganizationsOrganizationIdActivities
    const { activities, pagination } = z
      .object({
        activities: activitySchema.array(),
        pagination: paginationSchema,
      })
      .parse(
        hubstaffProjectId
          ? await this.request(
              `/projects/${hubstaffProjectId}/activities?${params.toString()}`,
              { next: { revalidate: 3600 } },
            )
          : await this.request(
              `/organizations/${ORG_ID}/activities?${params.toString()}`,
              { next: { revalidate: 3600 } },
            ),
      );

    const nextPageActivities = pagination?.next_page_start_id
      ? hubstaffProjectId
        ? await this.getActivities(
            startTime,
            stopTime,
            pagination.next_page_start_id,
            hubstaffProjectId,
          )
        : await this.getActivities(
            startTime,
            stopTime,
            pagination.next_page_start_id,
          )
      : [];

    return [...activities, ...nextPageActivities];
  }
}
