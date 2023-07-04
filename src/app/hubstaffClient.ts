import Hubstaff from '@app-masters/hubstaff-node-client';

const refreshTokenCallback = (accessToken: string, refreshToken: string) => {
  console.log('A new token has received');
  console.log('access token', accessToken);
  console.log('refresh token', refreshToken);
};

const ORGANIZATION_ID = process.env.ORGANIZATION_ID;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

class HubstaffClient extends Hubstaff {
  constructor() {
    // TODO: validate env
    super(
      {
        accessToken: process.env.ACCESS_TOKEN || '',
        refreshToken: process.env.REFRESH_TOKEN || '',
      },
      refreshTokenCallback
    );
  }
  // TODO: do we need this method?
  async getToken() {
    const tokenObj = await Hubstaff.getAccessToken(
      REFRESH_TOKEN ? REFRESH_TOKEN : ''
    );
    console.log('accessToken');
    console.log(tokenObj.accessToken);
    console.log('refreshToken');
    console.log(tokenObj.refreshToken);
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
    console.log(res);
    return res;
  }
}

export default HubstaffClient;
