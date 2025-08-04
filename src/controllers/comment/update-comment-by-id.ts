import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { UpdateCommentByIdInput } from 'src/api/routes/schemas/comment/UpdateCommentByIdReqSchema';

export async function updateCommentById(params: {
  commentRepo: ICommentRepo;
  commentId: string;
  data: UpdateCommentByIdInput;
}) {
  const comment = await params.commentRepo.updateCommentById(params.commentId, params.data);

  if (!comment) {
    throw new Error('Comment not found');
  }

  return comment;
}
