import { z } from 'zod';

export const GetHardDeletedUsersResSchema = z.object({
  archives: z.array(z.object({
    createdAt: z.date(),
    id: z.string().uuid(),
    profile: z.object({
      id: z.string().uuid(),
      createdAt: z.string().datetime(),
      deletedAt: z.string().datetime().nullable().optional(),
      updatedAt: z.string().datetime().nullable().optional(),
      email: z.string().email(),
      firstName: z.string(),
      lastName: z.string(),
      role: z.enum(['user', 'admin'])
    }),
    payload: z.object({
      comments: z.array(z.object({
        authorId: z.string().uuid(),
        postId: z.string().uuid(),
        text: z.string()
      })),
      posts: z.array(z.object({
        id: z.string().uuid(),
        title: z.string(),
        description: z.string().optional(),
        tags: z.array(z.object({
          id: z.string().uuid(),
          name: z.string()
        }))
      }))
    })
  }))
});