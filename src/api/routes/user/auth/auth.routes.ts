import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';
import { GetProfileResSchema } from 'src/api/routes/schemas/profile/GetProfileResSchema';
import { createAccount } from 'src/controllers/auth/create-account';
import { ERole } from 'src/types/profile/Role';

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
      response: {
        200: GetProfileResSchema
      },
      tags: ['auth']
    }
  }, async (req) => {
    const { email, password, firstName, lastName } = req.body; 
    const result = await createAccount({
      identityService: fastify.identityService,
      profileRepo: fastify.repos.profileRepo,
      email,
      password,
      firstName,
      lastName,
      role: ERole.user
    });
    
    return result;
  });
};

export default routes;
