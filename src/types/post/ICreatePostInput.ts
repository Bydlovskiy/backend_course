import { z } from 'zod';

export const CreatePostReqSchema = z.object({
  title: z.string(),
  description: z.string(),
  // authorId is injected on server side from authenticated request
  authorId: z.string().uuid().optional()
});

export type CreatePostInput = z.infer<typeof CreatePostReqSchema>;
