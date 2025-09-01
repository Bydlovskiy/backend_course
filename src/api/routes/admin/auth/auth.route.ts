import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { GetProfileResSchema } from 'src/api/routes/schemas/profile/GetProfileResSchema';
import { createAdmin } from 'src/controllers/auth/create-admin';

const routes: FastifyPluginAsync = async function (f) {
  const fastify = f.withTypeProvider<ZodTypeProvider>();

  fastify.addHook('onRoute', (routeOptions) => {
    if (!routeOptions.config) {
      routeOptions.config = {};
    }
    routeOptions.config.skipAuth = true;
  });

    fastify.post('/register', {
      schema: {
        body: z.object({
          email: z.string().email(),
          password: z.string().min(6),
          firstName: z.string(),
          lastName: z.string()
        }),
        response: { 200: GetProfileResSchema }
      }
    }, async (req) => {
      const { email, password, firstName, lastName } = req.body;
      const result = await createAdmin({
        identityService: (fastify as any).identityService,
        profileRepo: (fastify as any).repos.profileRepo,
        email,
        password,
        firstName,
        lastName
      });
      return result;
    });
};

export default routes;
