import { IIdentityService } from 'src/types/IIdentityService';
import { IProfileRepo } from 'src/types/repos/IProfileRepo';
import { ERole } from 'src/types/profile/Role';

export async function registerAccount(params: {
  identityService: IIdentityService;
  userRepo: IProfileRepo;
  email: string;
  role: ERole;
  firstName: string;
  lastName: string;
  activatedAt?: Date | null;
}) {
  const { identityService, userRepo, email, role, firstName, lastName, activatedAt } = params;

  await identityService.createUser(email, firstName, lastName);

  const profile = await userRepo.createProfile({
    email,
    role,
    firstName,
    lastName,
    activatedAt
  });

  return profile;
}
