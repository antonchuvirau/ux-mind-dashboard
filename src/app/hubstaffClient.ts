/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { prisma } from '@/server/db';
import jwtDecode from 'jwt-decode';
import { z } from 'zod';
import _ from 'lodash';
import { type HubstaffAccess } from '@prisma/client';
import { URLSearchParams } from 'url';
import { projectSchema, userSchema } from './hubstaffValidators';

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

  // TODO: pagination
  async getProjects() {
    const params = new URLSearchParams({ page_limit: PAGE_LIMIT.toString() });
    const res = await this.request(
      `/organizations/${ORG_ID}/projects?${params.toString()}`,
      { next: { revalidate: 3600 } }
    );

    const { projects } = z
      .object({
        projects: projectSchema.array(),
      })
      .parse(res);
    return projects;
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
}

export default HubstaffClient;
