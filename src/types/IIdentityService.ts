import { IdentityUser } from './IdentityUser';

export interface IIdentityService {
  getUserByAccessToken(token: string): Promise<IdentityUser>;
}