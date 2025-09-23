import { CreateCommentInput } from 'src/api/routes/schemas/comment/CreateCommentReqSchema';

import { ICommentRepo } from 'src/types/repos/ICommentRepo';
import { HttpError } from 'src/api/errors/HttpError';  

export async function createComment(params: {
  commentRepo: ICommentRepo;
  data: CreateCommentInput;
  postId: string;
  authorId: string;
}) {
    const comment = await params.commentRepo.createComment({
      text: params.data.text,
      postId: params.postId,
      authorId: params.authorId
    });

    if (!comment) {
      throw new HttpError(400, 'Comment not created');
    }

    return comment;
}
