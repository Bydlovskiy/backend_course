import { z } from 'zod';

export const GetProfileResSchema = z.object({
  id: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  role: z.enum(['user', 'admin']),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string()
});