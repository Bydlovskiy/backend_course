import { z } from 'zod';

export const GetSoftDeletedUsersResSchema = z.object({
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
});