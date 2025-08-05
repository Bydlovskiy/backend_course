import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { UpdateCommentByIdInput } from 'src/api/routes/schemas/comment/UpdateCommentByIdReqSchema';
import { HttpError } from 'src/api/errors/HttpError';  

export async function updateCommentById(params: {
  commentRepo: ICommentRepo;
  commentId: string;
  data: UpdateCommentByIdInput;
}) {
  const comment = await params.commentRepo.updateCommentById(params.commentId, params.data);

  if (!comment) {
    throw new HttpError(400, 'Comment not updated');
  }

  return comment;
}
