/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { prisma } from '@/server/db';
import jwtDecode from 'jwt-decode';
import { z } from 'zod';
import _ from 'lodash';
import { type HubstaffAccess } from '@prisma/client';
import { URLSearchParams } from 'url';
import {
  type HubstaffActivity,
  type HubstaffProject,
  activitySchema,
  paginationSchema,
  projectSchema,
  userSchema,
} from './hubstaffValidators';
import { differenceInCalendarDays } from 'date-fns';
import addDays from 'date-fns/addDays';

const BASE_URL = 'https://api.hubstaff.com/v2';
const ORG_ID = process.env.ORGANIZATION_ID || '';
const PAGE_LIMIT = 500;

class HubstaffClient {
  access: Partial<HubstaffAccess>;

  constructor() {
    this.access = {
      refreshToken: process.env.REFRESH_TOKEN || '',
    };
  }

  async refreshToken() {
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
      }
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

  async maybeRefreshToken() {
    // Get token from database if needed
    if (!this.access.accessToken) {
      // We assume only one hubstaffAccess will ever exist in DB. Maybe in future we will have more?
      this.access = await prisma.hubstaffAccess.findFirstOrThrow().catch(() => {
        console.log('HubstaffAccess does not exist in DB, creating new one');
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

  async request(
    endpoint: string,
    options: Parameters<typeof fetch>[1] = {} // This type is needed to be able to pass custom cache & revalidate options
  ) {
    await this.maybeRefreshToken();
    if (!this.access.accessToken)
      throw new Error('accessToken missing - something is wrong');

    const res = await fetch(`${BASE_URL}/${_.trimStart(endpoint, '/')}`, {
      ...options,
      ...(options.body && { ...{ body: JSON.stringify(options.body) } }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.access.accessToken || ''}`,
      },
    });
    return res.json();
  }

  async get(endpoint: string, options: Parameters<typeof fetch>[1]) {
    return this.request(endpoint, {
      method: 'GET',
      ...options,
    });
  }

  async getProject(id: number) {
    const res = await this.get(`projects/${id}`, {
      next: { revalidate: 60 },
    });
    const { project } = z
      .object({
        project: projectSchema,
      })
      .parse(res);
    return project;
  }

  async getProjects(pageId?: number): Promise<HubstaffProject[]> {
    const params = new URLSearchParams({
      page_limit: PAGE_LIMIT.toString(),
      page_start_id: pageId?.toString() || '',
    });
    const res = await this.request(
      `/organizations/${ORG_ID}/projects?${params.toString()}`,
      { next: { revalidate: 3600 } }
    );

    const { projects, pagination } = z
      .object({
        projects: projectSchema.array(),
        pagination: paginationSchema,
      })
      .parse(res);

    const nextPageProjects = pagination?.next_page_start_id
      ? await this.getProjects(pagination.next_page_start_id)
      : [];

    return [...projects, ...nextPageProjects];
  }

  async getUser(id: number) {
    const res = await this.get(`users/${id}`, {
      next: { revalidate: 3600 },
    });
    const { user } = z
      .object({
        user: userSchema,
      })
      .parse(res);
    return user;
  }

  async getOrganizationMembers() {
    const params = new URLSearchParams({ page_limit: PAGE_LIMIT.toString() });
    const res = await this.request(
      `/organizations/${ORG_ID}/members?${params.toString()}`,
      { next: { revalidate: 3600 } }
    );
    const { members } = z
      .object({
        members: z.object({ user_id: z.number() }).array(),
      })
      .parse(res);
    return Promise.all(members.map((member) => this.getUser(member.user_id)));
  }

  // TODO: add more filters that API supports
  async getActivities(
    startTime: Date,
    stopTime: Date,
    pageId?: number
  ): Promise<HubstaffActivity[]> {
    const difference = differenceInCalendarDays(stopTime, startTime);
    if (difference > 7) {
      const numberOfIntervals = Math.trunc(difference / 7);
      const dateIntervals: { startTime: Date, stopTime: Date }[] = [];
      let lastInterval = 0;
      if (difference % 7 > 0) {
        lastInterval = difference % 7;
      }
      let lastDate = startTime;
      for (let i = 0; i < numberOfIntervals; i++) {
        dateIntervals.push({
          startTime: lastDate,
          stopTime: addDays(lastDate, 7),
        });
        lastDate = addDays(lastDate, 7);
      }
      if (lastInterval > 0) {
        dateIntervals.push({
          startTime: lastDate,
          stopTime: stopTime,
        });
      }
      let resArray: {
        activities: HubstaffActivity[],
        pagination: {
          next_page_start_id: number,
        }
      }[] = [];
      const requests: any[] = [];
      dateIntervals.forEach((interval: { startTime: Date, stopTime: Date }) => {
        const params = new URLSearchParams({
          page_limit: PAGE_LIMIT.toString(),
          page_start_id: pageId?.toString() || '',
          'time_slot[start]': interval.startTime.toISOString(),
          'time_slot[stop]': interval.stopTime.toISOString(),
        });
        const res = this.request(
          `/organizations/${ORG_ID}/activities?${params.toString()}`,
          { next: { revalidate: 3600 } }
        );
        requests.push(res);
      });
      resArray = await Promise.all(requests);
      //console.log(resArray);
      let activities: HubstaffActivity[] = [];
      //console.log("dateIntervals");
      //console.log(dateIntervals);
      let i = 0;
      for (const item of resArray) {
        //console.log("dateIntervals");
        //console.log(dateIntervals[i].startTime);
        //console.log(dateIntervals[i].stopTime);
        const nextPageActivities = item.pagination?.next_page_start_id
        ? await this.getActivities(
            dateIntervals[i].startTime,
            dateIntervals[i].stopTime,
            item.pagination.next_page_start_id
          )
        : [];
        //console.log(item.pagination?.next_page_start_id);
        //console.log(activities.length);
        activities = activities.concat(item.activities).concat(nextPageActivities);
        i++;
        //console.log(activities.length);
        //console.log(nextPageActivities.length);
        //console.log(item.pagination?.next_page_start_id);
        //console.log(i + " iteration lenght");
        //console.log(activities.length);
      };
      //console.log("after");
      //console.log(activities);
      console.log("res lenght");
      console.log(activities.length);
      return activities;
    } else {
      const params = new URLSearchParams({
        page_limit: PAGE_LIMIT.toString(),
        page_start_id: pageId?.toString() || '',
        'time_slot[start]': startTime.toISOString(),
        'time_slot[stop]': stopTime.toISOString(),
      });
      const res = await this.request(
        `/organizations/${ORG_ID}/activities?${params.toString()}`,
        { next: { revalidate: 3600 } }
      );

      const { activities, pagination } = z
        .object({
          activities: activitySchema.array(),
          pagination: paginationSchema,
        })
        .parse(res);

      const nextPageActivities = pagination?.next_page_start_id
        ? await this.getActivities(
            startTime,
            stopTime,
            pagination.next_page_start_id
          )
        : [];

      return [...activities, ...nextPageActivities];
    }
  }
}

export default HubstaffClient;