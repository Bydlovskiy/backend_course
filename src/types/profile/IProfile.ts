import { z } from 'zod';

export const ProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(['user', 'admin']),
  createdAt: z.date(),
  updatedAt: z.date(),
  deletedAt: z.date().nullable().optional()
});

export type Profile = z.infer<typeof ProfileSchema>;
