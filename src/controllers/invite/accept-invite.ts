import { verifySignature } from 'src/services/kms/kms.service';
import { IProfileRepo } from 'src/types/repos/IProfileRepo';
import { HttpError } from 'src/api/errors/HttpError';
import { identityService } from 'src/services/aws/cognito/cognito.service';

export async function acceptInvite(params: {
  userRepo: IProfileRepo;
  email: string;
  signature: string;
  firstName: string;
  lastName: string;
  expireAt: number;
  password: string;
}) {
  const { userRepo, email, signature, firstName, lastName, expireAt, password } = params;

  const isValid = await verifySignature(email, expireAt, signature);
  if (!isValid) {
    throw new HttpError(400, 'Time for accept invite expired');
  }

  await identityService.updateUser(email, firstName, lastName);
  
  await identityService.setPassword(email, password);

  await userRepo.updateNamesByEmail({
    email,
    firstName,
    lastName
  });

  return { success: true };
}
