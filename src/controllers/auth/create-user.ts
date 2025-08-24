import { IIdentityService } from 'src/types/IIdentityService';
import { IProfileRepo } from 'src/types/repos/IProfileRepo';

export async function createAdmin(params: {
  identityService: IIdentityService,
  profileRepo: IProfileRepo,
  email: string,
  firstName: string,
  lastName: string,
  password: string
}) {
  // 1) Create user in Cognito (no email sent, per service implementation)
  const identityUser = await params.identityService.createUser(
    params.email,
    params.firstName,
    params.lastName
  );

  // 2) Create local profile in DB (keep repo thin: pure persistence)
  const profile = await params.profileRepo.createProfile({
    cognitoSub: identityUser.subId,
    email: params.email,
    firstName: params.firstName,
    lastName: params.lastName
  });

  // 3) Set permanent password in Cognito
  await params.identityService.setPassword(identityUser.subId, params.password);

  // 4) Return aggregated result DTO
  return {
    id: profile.id,
    createdAt: profile.createdAt,
    email: profile.email,
    firstName: params.firstName,
    lastName: params.lastName,
    subId: identityUser.subId,
    emailVerified: true,
    isEnabled: true
  };
}

// Simpler user creation for public registration flow
export async function createUser(params: {
  identityService: IIdentityService,
  profileRepo: IProfileRepo,
  email: string,
  password: string,
  firstName: string,
  lastName: string
}) {
  const identityUser = await params.identityService.createUser(
    params.email,
    params.firstName,
    params.lastName
  );

  const user = await params.profileRepo.createProfile({
    cognitoSub: identityUser.subId,
    email: params.email,
    firstName: params.firstName,
    lastName: params.lastName
  });

  await params.identityService.setPassword(identityUser.subId, params.password);

  return user;
}