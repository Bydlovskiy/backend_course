import { ICommentRepo } from 'src/types/repos/ICommentRepo';

export async function getCommentsByPostId(params: {
  commentRepo: ICommentRepo;
  postId: string;
}) {
  const comments = await params.commentRepo.getCommentsByPostId(params.postId);

  return {
    comments
  };
}