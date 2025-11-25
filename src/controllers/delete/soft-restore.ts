import { IPostRepo } from 'src/types/repos/IPostRepo';
import { IProfileRepo } from 'src/types/repos/IProfileRepo';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';

export async function softRestore(params: {
  profileRepo: IProfileRepo;
  postRepo: IPostRepo;
  commentRepo: ICommentRepo;
  userId: string;
}) {
  await params.profileRepo.softRestoreById(params.userId);
  await params.postRepo.softRestoreByAuthorId(params.userId);
  await params.commentRepo.softRestoreByAuthorId(params.userId);
}