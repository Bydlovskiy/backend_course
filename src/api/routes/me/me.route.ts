import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { GetProfileResSchema } from '../schemas/profile/GetProfileResSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      response: {
        200: GetProfileResSchema
      }
    }
  }, async req => {
    return req.profile!;
  });
};

export default routes;