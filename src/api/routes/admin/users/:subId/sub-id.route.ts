import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.post('/deactivate', {
    schema: {
      params: z.object({ subId: z.string() }),
      response: { 200: z.object({ success: z.literal(true) }) }
    }
  }, async (req) => {
    const { subId } = req.params as { subId: string };
    await fastify.identityService.deactivateUser(subId);
    return { success: true } as const;
  });

  fastify.post('/activate', {
    schema: {
      params: z.object({ subId: z.string() }),
      response: { 200: z.object({ success: z.literal(true) }) }
    }
  }, async (req) => {
    const { subId } = req.params as { subId: string };
    await fastify.identityService.activateUser(subId);
    return { success: true } as const;
  });
};

export default routes;
