import { IProfileRepo } from 'src/types/repos/IProfileRepo';

export async function getAllSoftDeletedUsers(params: {
  profileRepo: IProfileRepo;
}) {
  return await params.profileRepo.getAllSoftDeletedProfiles();
}