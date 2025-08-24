import { z } from 'zod';

export const CommentSchema = z.object({
  id: z.string().uuid(),
  postId: z.string().uuid(),
  authorId: z.string().uuid(),
  text: z.string(),
  updatedAt: z.date(),
  createdAt: z.date()
});

export type Comment = z.infer<typeof CommentSchema>;