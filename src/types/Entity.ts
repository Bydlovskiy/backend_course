import { z } from 'zod';

export const EntitySchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional().nullable(),
  updatedAt: z.date(),
  createdAt: z.date()
});

export type Entity = z.infer<typeof EntitySchema>;