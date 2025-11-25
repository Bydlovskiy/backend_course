import { IIdentityService } from 'src/types/IIdentityService';
import { HttpError } from 'src/api/errors/HttpError';  
import { IProfileRepo } from 'src/types/repos/IProfileRepo';

export async function getAllUsers(params: {
  identityService: IIdentityService;
  profileRepo: IProfileRepo;
  searchQuery?: string;
}) {
  const { identityService, profileRepo, searchQuery } = params;

  const [{ users: cognitoUsers }, { users: profileUsers }] = await Promise.all([
    identityService.listUsers({ searchQuery }),
    profileRepo.listProfiles({ limit: 1000, offset: 0, searchQuery })
  ]);

  if (!cognitoUsers || !profileUsers) {
    throw new HttpError(400, 'Users not found');
  }

  const profilesByEmail = new Map(
    cognitoUsers.map((user) => [user.email.toLowerCase(), user])
  );

  const mergedUsers = profileUsers.map((user) => {
    const profile = profilesByEmail.get(user.email.toLowerCase());

    return {
      email: user.email,
      firstName: profile?.firstName ?? user.firstName,
      lastName: profile?.lastName ?? user.lastName,
      id: user.id,
      deletedAt: user.deletedAt ?? null,
      isEnabled: profile?.isEnabled,
      status: profile?.status
    };
  });

  return mergedUsers;
}