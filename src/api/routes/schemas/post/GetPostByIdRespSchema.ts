import { z } from 'zod';

export const GetPostByIdRespSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  updatedAt: z.date(),
  createdAt: z.date(),
  commentsCount: z.number().optional().nullable()
});

export type Post = z.infer<typeof GetPostByIdRespSchema>;