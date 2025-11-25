import { IPostRepo } from 'src/types/repos/IPostRepo';
import { IProfileRepo } from 'src/types/repos/IProfileRepo';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';

export async function softDelete(params: {
  profileRepo: IProfileRepo;
  postRepo: IPostRepo;
  commentRepo: ICommentRepo;
  userId: string;
}) {
  await params.profileRepo.softDeleteById(params.userId);
  await params.postRepo.softDeleteByAuthorId(params.userId);
  await params.commentRepo.softDeleteByAuthorId(params.userId);
}