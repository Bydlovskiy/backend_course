import { z } from 'zod';

export const GetPostsListRespSchema = z.object({
  meta: z.object({
    total: z.number(),
    limit: z.number(),
    offset: z.number(),
    page: z.number(),
    totalPages: z.number()
  }),
  posts: z.array(z.object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    updatedAt: z.date(),
    createdAt: z.date(),
    commentsCount: z.number().optional()
  }))
});

export type PostList = z.infer<typeof GetPostsListRespSchema>;