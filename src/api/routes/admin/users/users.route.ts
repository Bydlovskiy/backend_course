import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { getAllUsers } from 'src/controllers/users/get-all-users';
import { softDelete } from 'src/controllers/delete/soft-delete';
import { softRestore } from 'src/controllers/delete/soft-restore';
import { getAllSoftDeletedUsers } from 'src/controllers/delete/get-all-soft-deleted';

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
            id: z.string().uuid().optional(),
            deletedAt: z.date().nullable().optional(),
            isEnabled: z.boolean().optional(),
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
      profileRepo: fastify.repos.profileRepo,
      searchQuery
    });
    
    return { users: result };
  });

  fastify.get('/soft-deleted', {
    schema: {
      response: {
        200: z.object({
          users: z.array(z.object({
            email: z.string().email(),
            firstName: z.string().optional(),
            lastName: z.string().optional(),
            id: z.string().uuid().optional(),
            role: z.enum(['user', 'admin']).optional(),
            createdAt: z.date().optional(),
            updatedAt: z.date().optional(),
            deletedAt: z.date().nullable().optional()
          }))
        })
      }
    }
  }, async () => {
    const result = await getAllSoftDeletedUsers({
      profileRepo: fastify.repos.profileRepo
    });
    return { users: result };
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

  fastify.post('/delete', {
    schema: {
      body: z.object({
        id: z.string().uuid()
      }),
      response: { 200: z.object({ success: z.literal(true) }) }
    }
  }, async (req) => {
    await softDelete({
      profileRepo: fastify.repos.profileRepo,
      postRepo: fastify.repos.postRepo,
      commentRepo: fastify.repos.commentRepo,
      userId: req.body.id
    });
    return { success: true } as const;
  });

  fastify.post('/restore', {
    schema: {
      body: z.object({
        id: z.string().uuid()
      }),
      response: { 200: z.object({ success: z.literal(true) }) }
    }
  }, async (req) => {
    await softRestore({
      profileRepo: fastify.repos.profileRepo,
      postRepo: fastify.repos.postRepo,
      commentRepo: fastify.repos.commentRepo,
      userId: req.body.id
    });
    return { success: true } as const;
  });
};

export default routes;
