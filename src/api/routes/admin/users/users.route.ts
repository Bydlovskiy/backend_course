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
            subId: z.string(),
            email: z.string().email(),
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            emailVerified: z.boolean().optional(),
            isEnabled: z.boolean().optional(),
            mfaEnabled: z.boolean().optional()
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
};

export default routes;
