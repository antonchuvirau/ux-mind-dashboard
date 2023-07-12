import { prisma } from '@/server/db';
import Hubstaff from '@app-masters/hubstaff-node-client';
import { type HubstaffAccess } from '@prisma/client';

const ORGANIZATION_ID = process.env.ORGANIZATION_ID;

class HubstaffClient extends Hubstaff {
  static async createClient() {
    // We assume only one hubstaffAccess will ever exist in DB. Maybe in future we will have more?
    const access = await prisma.hubstaffAccess.findFirstOrThrow().catch(() => {
      console.log('HubstaffAccess does not exist in DB, creating new one');
      return prisma.hubstaffAccess.create({
        data: {
          accessToken: process.env.ACCESS_TOKEN || '',
          refreshToken: process.env.REFRESH_TOKEN || '',
        },
      })
    }
    );

    return new HubstaffClient(access);
  }
  constructor(access: HubstaffAccess) {
    super(access, async (accessToken: string, refreshToken: string) => {
      console.log('Token has been refreshed', { accessToken });
      return prisma.hubstaffAccess.update({
        where: {},
        data: {
          accessToken,
          refreshToken,
        },
      });
    });
  }
  async getOrganizationUsers() {
    const members = await this.getOrganizationMembers(
      ORGANIZATION_ID ? Number(ORGANIZATION_ID) : 0
    );
    const res = await Promise.all(
      members.map(async (member) => {
        const user = await this.getUser(member.user_id ? member.user_id : -1);
        return user;
      })
    );
    return res;
  }
}

export default HubstaffClient;
