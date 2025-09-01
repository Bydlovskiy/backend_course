import { IIdentityService } from 'src/types/IIdentityService';
import { ERole } from 'src/types/profile/Role';
import { IProfileRepo } from 'src/types/repos/IProfileRepo';

export async function createAdmin(params: {
  identityService: IIdentityService,
  profileRepo: IProfileRepo,
  email: string,
  firstName: string,
  lastName: string,
  password: string
}) {
  const identityUser = await params.identityService.createUser(
    params.email,
    params.firstName,
    params.lastName
  );

  const admin = await params.profileRepo.createProfile({
    cognitoSub: identityUser.subId,
    email: params.email,
    role: ERole.admin,
    firstName: params.firstName,
    lastName: params.lastName
  });

  await params.identityService.setPassword(identityUser.subId, params.password);

  return admin;
}