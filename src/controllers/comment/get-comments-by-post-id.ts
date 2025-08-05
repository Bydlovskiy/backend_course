import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { HttpError } from 'src/api/errors/HttpError';  

export async function getCommentsByPostId(params: {
  commentRepo: ICommentRepo;
  postId: string;
}) {
  const comments = await params.commentRepo.getCommentsByPostId(params.postId);

  if (!comments) {
    throw new HttpError(400, 'Comments not found');
  }

  return {
    comments
  };
}