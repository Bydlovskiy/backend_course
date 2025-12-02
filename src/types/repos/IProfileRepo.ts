import { ERole } from '../profile/Role';
import { Profile } from 'src/types/profile/IProfile';

export interface IProfileRepo {
  createProfile(data: 
    { email: string;
      role: ERole;
      firstName: string;
      lastName: string;
      activatedAt?: Date | null }): Promise<Profile>;
  findByEmail(email: string): Promise<Profile | null>;
  listProfiles(params?: {
    limit?: number;
    offset?: number;
    searchQuery?: string;
  }): Promise<{
    users: Profile[];
    meta: { total: number; limit: number; offset: number; page: number; totalPages: number };
  }>;
  updateProfileByEmail(
    data: { email: string; firstName: string; lastName: string, activatedAt?: Date }
  ): Promise<Profile>;
  getAllSoftDeletedProfiles(): Promise<Profile[]>;
  softDeleteById(id: string): Promise<void>;
  softRestoreById(id: string): Promise<void>;
  findById(id: string): Promise<Profile | null>;
  deleteById(id: string): Promise<void>;
}