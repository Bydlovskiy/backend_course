import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { getAllUsers } from 'src/controllers/users/get-all-users';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.get('/', {
    schema: {
      querystring: z.object({
        searchQuery: z.string().optional()
      }),
      response: {
        200: z.object({
          users: z.array(z.object({
            email: z.string().email(),
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            emailVerified: z.boolean().optional(),
            isEnabled: z.boolean().optional(),
            mfaEnabled: z.boolean().optional(),
            status: z.enum(['FORCE_CHANGE_PASSWORD', 'CONFIRMED', 'PENDING_CONFIRMATION']).optional()
          })),
          paginationToken: z.string().optional()
        })
      }
    }
  }, async (req) => {
    const { searchQuery } = req.query;
    const result = await getAllUsers({
      identityService: fastify.identityService,
      searchQuery
    });
    return result;
  });

  fastify.post('/deactivate', {
    schema: {
      body: z.object({
        email: z.string().email()
      }),
      response: { 200: z.object({ success: z.literal(true) }) }
    }
  }, async (req) => {
    await fastify.identityService.deactivateUser(req.body.email);
    return { success: true } as const;
  });

  fastify.post('/activate', {
    schema: {
      body: z.object({
        email: z.string().email()
      }),
      response: { 200: z.object({ success: z.literal(true) }) }
    }
  }, async (req) => {
    await fastify.identityService.activateUser(req.body.email);
    return { success: true } as const;
  });
};

export default routes;
