import { ERole } from 'src/types/profile/Role';
import { z } from 'zod';

export const GetSoftDeletedUsersResSchema = z.object({
  users: z.array(z.object({
    email: z.string().email(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    id: z.string().uuid().optional(),
    role: z.enum([ERole.admin, ERole.user]).optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    deletedAt: z.date().nullable().optional()
  }))
});