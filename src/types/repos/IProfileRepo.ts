import { ERole } from '../profile/Role';
import { Profile } from 'src/types/profile/IProfile';

export interface IProfileRepo {
  createProfile(data: 
    { cognitoSub: string;
      email: string;
      role: ERole;
      firstName: string;
      lastName: string }): Promise<Profile>;
  findByCognitoSub(cognitoSub: string): Promise<Profile | null>;
  listProfiles(params?: {
    limit?: number;
    offset?: number;
    searchQuery?: string;
  }): Promise<{
    users: Profile[];
    meta: { total: number; limit: number; offset: number; page: number; totalPages: number };
  }>;
}