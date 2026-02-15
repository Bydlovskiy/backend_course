import { z } from 'zod';

export const DeletedPostResSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  tags: z.array(z.object({
    id: z.string().uuid(),
    name: z.string()
  }))
});

export type DeletedPostRes = z.infer<typeof DeletedPostResSchema>;