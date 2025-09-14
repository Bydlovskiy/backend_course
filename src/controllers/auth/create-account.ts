import { IIdentityService } from 'src/types/IIdentityService';
import { ERole } from 'src/types/profile/Role';
import { IProfileRepo } from 'src/types/repos/IProfileRepo';

export async function createAccount(params: {
  identityService: IIdentityService,
  profileRepo: IProfileRepo,
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  role: ERole
}) {
  await params.identityService.createUser(
    params.email,
    params.firstName,
    params.lastName
  );

  const account = await params.profileRepo.createProfile({
    email: params.email,
    role: params.role,
    firstName: params.firstName,
    lastName: params.lastName
  });

  await params.identityService.setPassword(params.email, params.password);

  return account;
}