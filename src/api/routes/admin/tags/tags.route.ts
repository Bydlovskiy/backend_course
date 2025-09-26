import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { adminHook } from 'src/api/hooks/admin.hook';
import { createTag } from 'src/controllers/tag/create-tag';
import { CreateTagReqSchema, TagSchema } from 'src/api/routes/schemas/tag/TagSchemas';

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
};

export default routes;
