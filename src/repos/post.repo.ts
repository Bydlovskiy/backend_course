import { z } from 'zod';
import { eq, count } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { postsTable } from '../services/drizzle/schemas/schema';
import { commentsTable } from '../services/drizzle/schemas/schema';
import { IPostRepo } from '../types/repos/IPostRepo';

import { UpdatePostByIdInput } from 'src/types/post/IUpdatePostById';
import { CreatePostInput } from 'src/types/post/ICreatePostInput';

import { PostSchema } from 'src/types/post/IPost';

export function getPostRepo(db: NodePgDatabase): IPostRepo {
  return {
    async createPost(data: CreatePostInput) {
      const post = await db.insert(postsTable).values(data as any).returning();
      return PostSchema.parse(post[0]);
    },

    async getPostById(id: string) {
      const results = await db
        .select()
        .from(postsTable)
        .leftJoin(commentsTable, eq(postsTable.id, commentsTable.postId))
        .where(eq(postsTable.id, id));
      
      if (results.length === 0) {
        return null;
      }

      return PostSchema.parse({
        ...results[0].posts,
        comments: results.map(el => el.comments).filter(Boolean)
      });
    },

    async getAllPosts(params: { limit: number; offset: number } = { limit: 10, offset: 0 }) {
      const limit = params?.limit ?? 10;
      const offset = params?.offset ?? 0;

      const result = await db
        .select({
          id: postsTable.id,
          title: postsTable.title,
          description: postsTable.description,
          createdAt: postsTable.createdAt,
          updatedAt: postsTable.updatedAt,
          commentsCount: count(commentsTable.id)
        })
        .from(postsTable)
        .leftJoin(commentsTable, eq(postsTable.id, commentsTable.postId))
        .groupBy(postsTable.id)
        .orderBy(postsTable.createdAt)
        .limit(limit)
        .offset(offset);

      if (result.length === 0) {
        return null;
      }
      
      return z.array(PostSchema).parse(result);
    },

    async updatePostById(id: string, data: UpdatePostByIdInput) {
      const posts = await db
        .update(postsTable)
        .set(data)
        .where(eq(postsTable.id, id))
        .returning();
      
      return posts.length > 0 ? PostSchema.parse(posts[0]) : null;
    }
  };
}
