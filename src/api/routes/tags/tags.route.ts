import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';

import { ListTagsResSchema } from 'src/api/routes/schemas/tag/TagSchemas';
import { listTags } from 'src/controllers/tag/list-tags';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      response: { 200: ListTagsResSchema }
    }
  }, async () => {
    return await listTags({ tagRepo: fastify.repos.tagRepo });
  });
};

export default routes;
