import { z } from 'zod';

export const CreatePostReqSchema = z.object({
  title: z.string(),
  description: z.string(),
  // authorId is injected on server side from authenticated request
  authorId: z.string().uuid().optional(),
  tags: z.array(z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(1)
  })).optional().default([])
});

export type CreatePostInput = z.infer<typeof CreatePostReqSchema>;
