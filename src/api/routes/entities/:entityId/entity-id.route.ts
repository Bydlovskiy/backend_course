import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { GetEntityByIdRespSchema } from 'src/api/routes/schemas/GetEntityByIdRespSchema';
import { z } from 'zod';
import { updateEntityById } from 'src/controllers/entity/update-entity-by-id';
import { UpdateEntityReqSchema } from '../../schemas/UpdateEntitiesReqSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.patch('/', {
    schema: {
      params: z.object({
        entityId: z.string().uuid()
      }),
      response: {
        200: GetEntityByIdRespSchema
      },
      body: UpdateEntityReqSchema
    }
  }, async req => {
    const entity = await updateEntityById({
      entityRepo: fastify.repos.entityRepo,
      entityId: req.params.entityId,
      data: req.body
    });
    return entity;
  });
};

export default routes;