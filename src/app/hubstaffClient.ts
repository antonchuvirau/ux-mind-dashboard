import { prisma } from '@/server/db';
import jwtDecode from 'jwt-decode';
import { z } from 'zod';
import _ from 'lodash';
import { type HubstaffAccess } from '@prisma/client';
import { URLSearchParams } from 'url';

const BASE_URL = 'https://api.hubstaff.com/v2';

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
      .preprocess(
        (value: unknown) => ({
          accessToken: value.access_token,
          refreshToken: value.refresh_token,
        }),
        z.object({
          accessToken: z.string(),
          refreshToken: z.string(),
        })
      )
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

  async getProject(projectId: number) {
    const res = await this.get(`projects/${projectId}`, {
      next: { revalidate: 60 },
    });
    const { project } = z
      .object({
        project: z.object({
          id: z.number(),
          name: z.string(),
          status: z.string(),
        }),
      })
      .parse(res);
    return project;
  }
}

export default HubstaffClient;
