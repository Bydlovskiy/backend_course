import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { CreatePostReqSchema } from 'src/api/routes/schemas/post/CreatePostReqSchema';
import { GetPostsListRespSchema } from 'src/api/routes/schemas/post/GetPostsListRespSchema';
import { GetPostByIdRespSchema } from 'src/api/routes/schemas/post/GetPostByIdRespSchema';

import { createPost } from 'src/controllers/post/create-post';
import { getAllPosts } from 'src/controllers/post/get-all-posts';

const adminPostsRoutes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.register(async function (r) {
    const fastify = r.withTypeProvider<ZodTypeProvider>();

    fastify.post('/', {
      schema: {
        response: { 
          200: GetPostByIdRespSchema 
        },
        body: CreatePostReqSchema
      }
    }, async (req) => {
      const post = await createPost({
        postRepo: fastify.repos.postRepo,
        tagRepo: fastify.repos.tagRepo,
        data: { ...req.body, authorId: req.profile!.id }
      });
      return post;
    });

    fastify.get('/', {
      schema: {
        response: { 200: GetPostsListRespSchema },
        querystring: z.object({
          limit: z.coerce.number().int().positive().optional(),
          offset: z.coerce.number().int().min(0).optional(),
          page: z.coerce.number().int().min(1).optional(),
          searchQuery: z.string().optional(),
          sortBy: z.enum(['title', 'createdAt', 'commentsCount']).optional(),
          sortDirection: z.enum(['asc', 'desc']).optional(),
          minCommentsCount: z.coerce.number().int().min(0).optional()
        })
      }
    }, async (req) => {
      return await getAllPosts({
        postRepo: fastify.repos.postRepo,
        limit: req.query.limit,
        offset: req.query.offset,
        searchQuery: req.query.searchQuery,
        sortBy: req.query.sortBy,
        sortDirection: req.query.sortDirection,
        minCommentsCount: req.query.minCommentsCount
      });
    });
  });
};

export default adminPostsRoutes;
