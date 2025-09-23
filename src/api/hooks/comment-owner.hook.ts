import { preHandlerAsyncHookHandler } from 'fastify';

import { HttpError } from '../errors/HttpError';

export const commentOwnerHook: preHandlerAsyncHookHandler = async function (request) {
  const commentId = (request.params as any)?.commentId;

  const commentRepo = request.server.repos.commentRepo;

  const existing = await commentRepo.getCommentById(commentId);
  if (!existing) {
    throw new HttpError(404, 'Comment not found');
  }

  if (existing.authorId !== request.profile?.id) {
    throw new HttpError(403, 'Forbidden: only the author can update this comment');
  }
};
