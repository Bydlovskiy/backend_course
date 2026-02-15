import { IProfileRepo } from 'src/types/repos/IProfileRepo';
import { Profile } from 'src/types/profile/IProfile';

export async function validateUserExists(
  profileRepo: IProfileRepo,
  userId: string
): Promise<Profile> {
  const user = await profileRepo.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  return user;
}
