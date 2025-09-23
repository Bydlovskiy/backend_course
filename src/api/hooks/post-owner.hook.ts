import { preHandlerAsyncHookHandler } from 'fastify';

import { HttpError } from '../errors/HttpError';

export const postOwnerHook: preHandlerAsyncHookHandler = async function (request) {
  const postId = (request.params as any)?.postId;

  const postRepo = request.server.repos.postRepo;

  const existing = await postRepo.getPostById(postId);
  if (!existing) {
    throw new HttpError(404, 'Post not found');
  }

  if (existing.authorId !== request.profile?.id) {
    throw new HttpError(403, 'Forbidden: only the author can update this post');
  }
};
