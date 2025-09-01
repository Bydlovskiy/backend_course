import { IdentityUser } from './IdentityUser';

export interface IIdentityService {
  createUser(email: string, firstName?: string, lastName?: string): Promise<IdentityUser>;
  updateUser(subId: string, firstName?: string, lastName?: string): Promise<boolean>;
  getUserBySubId(subId: string): Promise<IdentityUser>;
  getUserByAccessToken(token: string): Promise<IdentityUser>;
  setPassword(subId: string, password: string): Promise<void>;
  listUsers(params: { searchQuery?: string }): Promise<{
    users: Array<IdentityUser & { isEnabled?: boolean; firstName?: string; lastName?: string; }>; 
  }>;
  deactivateUser(subId: string): Promise<void>;
  activateUser(subId: string): Promise<void>;
}