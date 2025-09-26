import { z } from 'zod';

export const UpdatePostByIdReqSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional(),
  tags: z.array(z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1)
  })).optional().default([])
});

export type UpdatePostByIdInput = z.infer<typeof UpdatePostByIdReqSchema>;