import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';

export async function getAllHardDeletedUsers(params: {
  archiveRepo: IArchiveRepo;
}) {
  return await params.archiveRepo.getAllArchives();
}
