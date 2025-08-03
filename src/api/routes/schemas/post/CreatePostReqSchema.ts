import { z } from 'zod';

export const CreatePostReqSchema = z.object({
  title: z.string(),
  description: z.string()
});

export type CreatePostInput = z.infer<typeof CreatePostReqSchema>;
