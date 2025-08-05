import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { CreateCommentResSchema } from 'src/api/routes/schemas/comment/CreateCommentResSchema';
import { CreateCommentReqSchema } from 'src/api/routes/schemas/comment/CreateCommentReqSchema';

import { createComment } from 'src/controllers/comment/create-comment';
import { getCommentsByPostId } from 'src/controllers/comment/get-comments-by-post-id';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    schema: {
      params: z.object({
        postId: z.string().uuid()
      }),
      response: {
        200: CreateCommentResSchema
      },
      body: CreateCommentReqSchema
    }
  }, async req => {
    const post = await createComment({
      commentRepo: fastify.repos.commentRepo,
      data: {
        text: req.body.text
      },
      postId: req.params.postId
    });
    return post;
  });

  fastify.get('/', {
    schema: {
      params: z.object({
        postId: z.string().uuid()
      }),
      response: {
        200: z.object({
          comments: z.array(CreateCommentResSchema)
        })
      }
    }
  }, async req => {
    const result = await getCommentsByPostId({
      commentRepo: fastify.repos.commentRepo,
      postId: req.params.postId
    });
    return result;
  });
};

export default routes;