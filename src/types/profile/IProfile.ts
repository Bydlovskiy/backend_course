import { z } from 'zod';
import { ERole } from './Role';

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum([ERole.admin, ERole.user]),
  createdAt: z.date(),
  updatedAt: z.date(),
  activatedAt: z.date().nullable().optional(),
  deletedAt: z.date().nullable().optional()
});

export type Profile = z.infer<typeof ProfileSchema>;
