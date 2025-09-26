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
    authorId: z.string(),
    author: z.object({
      id: z.string(),
      email: z.string().email(),
      firstName: z.string(),
      lastName: z.string(),
      createdAt: z.date(),
      updatedAt: z.date()
    }),
    updatedAt: z.date(),
    createdAt: z.date(),
    commentsCount: z.number().optional()
    // tags: z.array(z.object({ id: z.string().uuid(), name: z.string() }))
  }))
});

export type PostList = z.infer<typeof GetPostsListRespSchema>;