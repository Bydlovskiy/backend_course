import { z } from 'zod';
import { CommentSchema } from './IComment';

export const PostSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  updatedAt: z.date(),
  createdAt: z.date(),
  commentsCount: z.number().optional(),
  comments: z.array(CommentSchema).optional()
});

export type Post = z.infer<typeof PostSchema>;

export const PostListSchema = z.object({
  posts: z.array(PostSchema)
});

export type PostList = z.infer<typeof PostListSchema>;