import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { CreateCommentResSchema } from 'src/api/routes/schemas/comment/CreateCommentResSchema';
import { UpdateCommentByIdReqSchema } from 'src/api/routes/schemas/comment/UpdateCommentByIdReqSchema';

import { updateCommentById } from 'src/controllers/comment/update-comment-by-id';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.patch('/', {
    schema: {
      params: z.object({
        postId: z.string().uuid(),
        commentId: z.string().uuid()
      }),
      response: {
        200: CreateCommentResSchema
      },
      body: UpdateCommentByIdReqSchema
    }
  }, async req => {
    return await updateCommentById({
      commentRepo: fastify.repos.commentRepo,
      commentId: req.params.commentId,
      data: req.body
    });
  });
};

export default routes;