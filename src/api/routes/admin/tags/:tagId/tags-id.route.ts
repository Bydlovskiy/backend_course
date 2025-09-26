import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { adminHook } from 'src/api/hooks/admin.hook';
import { createTag } from 'src/controllers/tag/create-tag';
import { updateTag } from 'src/controllers/tag/update-tag';
import { deleteTag } from 'src/controllers/tag/delete-tag';
import { CreateTagReqSchema, TagSchema, UpdateTagReqSchema } from 'src/api/routes/schemas/tag/TagSchemas';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    preHandler: adminHook,
    schema: {
      body: CreateTagReqSchema,
      response: { 200: TagSchema }
    }
  }, async (req) => {
    return await createTag({ tagRepo: fastify.repos.tagRepo, name: req.body.name });
  });

  fastify.patch('/', {
    schema: {
      params: z.object({ tagId: z.string().uuid() }),
      body: UpdateTagReqSchema,
      response: { 200: TagSchema }
    }
  }, async (req) => {
    return await updateTag({ 
      tagRepo: fastify.repos.tagRepo,
      tagId: req.params.tagId,
      name: req.body.name
    });
  });

  fastify.delete('/', {
    schema: {
      params: z.object({ tagId: z.string().uuid() }),
      response: { 204: z.null() }
    }
  }, async (req, reply) => {
    await deleteTag({ tagRepo: fastify.repos.tagRepo, tagId: req.params.tagId });
    return reply.status(204).send();
  });
};

export default routes;
