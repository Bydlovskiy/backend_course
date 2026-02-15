import { FastifyPluginAsync } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

import { getAllUsers } from 'src/controllers/users/get-all-users';
import { softDelete } from 'src/controllers/delete/soft-delete';
import { softRestore } from 'src/controllers/delete/soft-restore';
import { getAllSoftDeletedUsers } from 'src/controllers/delete/get-all-soft-deleted';
import { hardDelete } from 'src/controllers/delete/hard-delete';
import { restoreHardDeleted } from 'src/controllers/delete/restore-hard-deleted';
import { getAllHardDeletedUsers } from 'src/controllers/delete/get-all-hard-deleted';

import { GetSoftDeletedUsersResSchema } from 'src/api/routes/schemas/delete/GetSoftDeletedUsersResSchema';
import { GetHardDeletedUsersResSchema } from 'src/api/routes/schemas/delete/GetHardDeletedUsersResSchema';

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
        200: GetSoftDeletedUsersResSchema
      }
    }
  }, async () => {
    const result = await getAllSoftDeletedUsers({
      profileRepo: fastify.repos.profileRepo
    });
    return { users: result };
  });

  fastify.get('/hard-deleted', {
    schema: {
      response: {
        200: GetHardDeletedUsersResSchema 
      }
    }
  }, async () => {
    const result = await getAllHardDeletedUsers({
      archiveRepo: fastify.repos.archiveRepo
    });
    return { archives: result };
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
      userId: req.body.id,
      profileRepo: fastify.repos.profileRepo,
      transactionManager: fastify.transaction,
      identityService: fastify.identityService
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
      userId: req.body.id,
      profileRepo: fastify.repos.profileRepo,
      transactionManager: fastify.transaction,
      identityService: fastify.identityService
    });
    return { success: true } as const;
  });

  fastify.post('/hard-delete', {
    schema: {
      body: z.object({
        id: z.string().uuid()
      }),
      response: { 
        200: z.object({ success: z.literal(true) }),
        500: z.object({ success: z.literal(false) })
      }
    }
  }, async (req, reply) => {
    try {
      await hardDelete({
        profileRepo: fastify.repos.profileRepo,
        postRepo: fastify.repos.postRepo,
        commentRepo: fastify.repos.commentRepo,
        archiveRepo: fastify.repos.archiveRepo,
        userId: req.body.id,
        transactionManager: fastify.transaction, 
        identityService: fastify.identityService
      });
      return { success: true } as const;
    } catch (e) {
      console.error('Hard delete failed:', e);
      reply.code(500);
      return { success: false } as const;
    }
  });

  fastify.post('/restore-hard-deleted', {
    schema: {
      body: z.object({
        id: z.string().uuid()
      }),
      response: { 200: z.object({ success: z.literal(true) }) }
    }
  }, async (req) => {
    await restoreHardDeleted({
      archiveRepo: fastify.repos.archiveRepo,
      userId: req.body.id,
      transactionManager: fastify.transaction,
      identityService: fastify.identityService
    });
    return { success: true } as const;
  });
};

export default routes;
