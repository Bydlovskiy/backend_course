import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { CreateEntityReqSchema } from '../schemas/CreateEntityReqSchema';
import { GetEntityByIdRespSchema } from '../schemas/GetEntityByIdRespSchema';
import { createEntity } from 'src/controllers/entity/create-entity';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/', {
    schema: {
      response: {
        200: GetEntityByIdRespSchema
      },
      body: CreateEntityReqSchema
    }
  }, async req => {
    const entity = await createEntity({
      entityRepo: fastify.repos.entityRepo,
      data: req.body
    });
    return entity;
  });
};

export default routes;