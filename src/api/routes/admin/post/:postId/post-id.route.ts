import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { GetPostByIdRespSchema } from 'src/api/routes/schemas/post/GetPostByIdRespSchema';
import { UpdatePostByIdReqSchema } from 'src/api/routes/schemas/post/UpdatePostByIdReqSchema';

import { getPostById } from 'src/controllers/post/get-post-by-id';
import { updatePostById } from 'src/controllers/post/update-post-by-id';

const adminPostsRoutes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      params: z.object({
        postId: z.string().uuid()
      }),
      response: {
        200: GetPostByIdRespSchema
      }
    }
  }, async req => {
    return await getPostById({
      postRepo: fastify.repos.postRepo,
      postId: req.params.postId
    });
  });

  fastify.patch('/', {
    schema: {
      params: z.object({
        postId: z.string().uuid()
      }),
      response: {
        200: GetPostByIdRespSchema
      },
      body: UpdatePostByIdReqSchema
    }
  }, async req => {
    return await updatePostById({
      postRepo: fastify.repos.postRepo,
      tagRepo: fastify.repos.tagRepo,
      postId: req.params.postId,
      data: req.body
    });
  });
};

export default adminPostsRoutes;
