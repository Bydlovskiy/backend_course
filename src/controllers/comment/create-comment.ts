import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { CreateCommentInput } from 'src/api/routes/schemas/comment/CreateCommentReqSchema';

export async function createComment(params: {
  commentRepo: ICommentRepo;
  data: CreateCommentInput;
  postId: string;
}) {
  const comment = await params.commentRepo.createComment({
    text: params.data.text,
    postId: params.postId
  });

  return comment;
}
