import { IIdentityService } from 'src/types/IIdentityService';
import { ERole } from 'src/types/profile/Role';
import { IProfileRepo } from 'src/types/repos/IProfileRepo';

import { registerAccount } from 'src/controllers/common/register-account';

export async function createAccount(params: {
  identityService: IIdentityService,
  profileRepo: IProfileRepo,
  email: string,
  firstName: string,
  lastName: string,
  password: string,
  role: ERole
}) {
  const account = await registerAccount({
    identityService: params.identityService,
    userRepo: params.profileRepo,
    email: params.email,
    role: params.role,
    firstName: params.firstName,
    lastName: params.lastName,
    activatedAt: new Date()
  });

  await params.identityService.setPassword(params.email, params.password);

  return account;
}