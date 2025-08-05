import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { CreatePostReqSchema } from 'src/api/routes/schemas/post/CreatePostReqSchema';
import { GetPostByIdRespSchema } from 'src/api/routes/schemas/post/GetPostByIdRespSchema';
import { GetPostsListRespSchema } from 'src/api/routes/schemas/post/GetPostsListRespSchema';

import { createPost } from 'src/controllers/post/create-post';
import { getAllPosts } from 'src/controllers/post/get-all-posts';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
      schema: {
        response: {
          200: GetPostByIdRespSchema
        },
        body: CreatePostReqSchema
      }
    },
    async req => {
      const post = await createPost({
        postRepo: fastify.repos.postRepo,
        data: req.body
      });
      return post;
    }
  );

  fastify.get('/', {
    schema: {
      response: {
        200: GetPostsListRespSchema
      }
    }
  }, async () => {
    const posts = await getAllPosts({
      postRepo: fastify.repos.postRepo
    });

    return posts;
  });
};

export default routes;
