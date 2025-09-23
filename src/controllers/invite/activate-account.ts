import { verifySignature } from 'src/services/kms/kms.service';

import { IProfileRepo } from 'src/types/repos/IProfileRepo';
import { IIdentityService } from 'src/types/IIdentityService';

import { HttpError } from 'src/api/errors/HttpError';

export async function acceptInvite(params: {
  identityService: IIdentityService;
  userRepo: IProfileRepo;
  email: string;
  signature: string;
  firstName: string;
  lastName: string;
  expireAt: number;
  password: string;
}) {
  const {
    identityService,
    userRepo,
    email,
    signature,
    firstName,
    lastName,
    expireAt,
    password 
  } = params;

  const isValid = await verifySignature(email, expireAt, signature);
  if (!isValid) {
    throw new HttpError(400, 'Time for accept invite expired');
  }

  await identityService.updateUser(email, firstName, lastName);
  
  await identityService.setPassword(email, password);

  await userRepo.updateProfileByEmail({
    email,
    firstName,
    lastName,
    activatedAt: new Date()
  });

  return { success: true };
}
