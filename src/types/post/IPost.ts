import { z } from 'zod';
import { CommentSchema } from '../comment/IComment';
import { ProfileSchema } from '../profile/IProfile';

export const PostSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  authorId: z.string().uuid(),
  updatedAt: z.date(),
  createdAt: z.date(),
  commentsCount: z.number().optional(),
  comments: z.array(CommentSchema).optional(),
  author: ProfileSchema.optional(),
  tags: z.array(z.object({ id: z.string().uuid(), name: z.string() })).optional()
});

export type Post = z.infer<typeof PostSchema>;