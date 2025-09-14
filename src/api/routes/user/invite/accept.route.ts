import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { acceptInvite } from 'src/controllers/invite/accept-invite';
import { AcceptInviteReqSchema } from 'src/api/routes/schemas/invite/AcceptInviteReqSchema';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.addHook('onRoute', (routeOptions) => {
    if (!routeOptions.config) {
      routeOptions.config = {};
    }
    routeOptions.config.skipAuth = true;
  });

  fastify.post('/accept', {
    schema: {
      body: AcceptInviteReqSchema,
      response: {
        200: z.object({
          success: z.boolean()
        })
      }
    }
  }, async (req) => {
    const { email, signature, firstName, lastName, expireAt, password } = req.body;
    await acceptInvite({
      userRepo: fastify.repos.profileRepo,
      email,
      signature,
      firstName,
      lastName,
      expireAt,
      password
    });
    return { success: true };
  });
};

export default routes;
