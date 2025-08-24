import { z } from 'zod';
import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { GetPostByIdRespSchema } from 'src/api/routes/schemas/post/GetPostByIdRespSchema';
import { UpdatePostByIdReqSchema } from 'src/api/routes/schemas/post/UpdatePostByIdReqSchema';

import { getPostById } from 'src/controllers/post/get-post-by-id';
import { updatePostById } from 'src/controllers/post/update-post-by-id';

const routes: FastifyPluginAsync = async function (f) {
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
    const post = await getPostById({
      postRepo: fastify.repos.postRepo,
      postId: req.params.postId
    });
    return post;
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
    const post = await updatePostById({
      postRepo: fastify.repos.postRepo,
      postId: req.params.postId,
      data: req.body,
      currentUserId: req.profile?.id
    });
    return post;
  });
};

export default routes;