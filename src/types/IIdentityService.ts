import { IdentityUser } from './IdentityUser';

export interface IIdentityService {
  createUser(email: string, firstName?: string, lastName?: string): Promise<IdentityUser>;
  updateUser(email: string, firstName?: string, lastName?: string): Promise<boolean>;
  getUserByEmail(email: string): Promise<IdentityUser>;
  getUserByAccessToken(token: string): Promise<IdentityUser>;
  setPassword(email: string, password: string): Promise<void>;
  listUsers(params: { searchQuery?: string }): Promise<{
    users: Array<IdentityUser & { isEnabled?: boolean; firstName?: string; lastName?: string; }>; 
  }>;
  deactivateUser(email: string): Promise<void>;
  activateUser(email: string): Promise<void>;
}