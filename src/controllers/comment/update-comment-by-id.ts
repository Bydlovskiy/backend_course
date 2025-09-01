import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { UpdateCommentByIdInput } from 'src/api/routes/schemas/comment/UpdateCommentByIdReqSchema';
import { HttpError } from 'src/api/errors/HttpError';  

export async function updateCommentById(params: {
  commentRepo: ICommentRepo;
  commentId: string;
  data: UpdateCommentByIdInput;
  currentUserId: string | null | undefined;
  isAdmin?: boolean;
}) {
  if (!params.currentUserId) {
    throw new HttpError(401, 'Unauthorized');
  }

  const existing = await params.commentRepo.getCommentById(params.commentId);
  if (!existing) {
    throw new HttpError(404, 'Comment not found');
  }
  console.log('--------------0---------------');
  console.log(params.isAdmin);  
  if (!params.isAdmin && existing.authorId !== params.currentUserId) {
    throw new HttpError(403, 'Forbidden: only the author can update this comment');
  }

  const comment = await params.commentRepo.updateCommentById(params.commentId, params.data);

  if (!comment) {
    throw new HttpError(400, 'Comment not updated');
  }

  return comment;
}
