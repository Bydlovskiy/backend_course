import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { CreateCommentReqSchema } from 'src/api/routes/schemas/comment/CreateCommentReqSchema';
import { CreateCommentResSchema } from 'src/api/routes/schemas/comment/CreateCommentResSchema';

import { createComment } from 'src/controllers/comment/create-comment';
import { getCommentsByPostId } from 'src/controllers/comment/get-comments-by-post-id';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.register(async function (r) {
    const router = r.withTypeProvider<ZodTypeProvider>();

    router.post('/', {
      schema: {
        params: z.object({
          postId: z.string().uuid()
        }),
        response: {
          200: CreateCommentResSchema
        },
        body: CreateCommentReqSchema
      }
    }, async (req) => {
      return  await createComment({
        commentRepo: fastify.repos.commentRepo,
        data: {
          text: req.body.text
        },
        postId: req.params.postId,
        authorId: req.profile!.id
      });
    });

    router.get('/', {
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
    }, async (req) => {
      return await getCommentsByPostId({
        commentRepo: fastify.repos.commentRepo,
        postId: req.params.postId
      });
    });
  });
};

export default routes;
