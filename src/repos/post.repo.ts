import { z } from 'zod';
import { eq, count, or, ilike, desc, asc } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';

import { postsTable } from 'src/services/drizzle/schemas/schema';
import { commentsTable } from 'src/services/drizzle/schemas/schema';
import { IPostRepo, SortDirection, SortField } from 'src/types/repos/IPostRepo';

import { UpdatePostByIdInput } from 'src/types/post/IUpdatePostById';
import { CreatePostInput } from 'src/types/post/ICreatePostInput';

import { PostSchema } from 'src/types/post/IPost';
import { HttpError } from 'src/api/errors/HttpError';

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

    async getAllPosts(params: { 
      limit?: number; 
      offset?: number; 
      searchQuery?: string;
      sortBy?: SortField;
      sortDirection?: SortDirection;
    }) {
      if (params?.limit && params.limit > 100) {
        throw new HttpError(1001, 'Limit cannot exceed 100');
      }
      
      const limit = params?.limit ?? 10;
      const offset = params?.offset ?? 0;
      const searchQuery = params?.searchQuery?.trim();
      const sortBy = params?.sortBy ?? 'createdAt';
      const sortDirection = params?.sortDirection ?? 'desc';

      let whereClause = undefined;
      if (searchQuery) {
        whereClause = or(
          ilike(postsTable.title, `%${searchQuery}%`),
          ilike(postsTable.description, `%${searchQuery}%`)
        );
      }
      
      const query = db
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
        .where(whereClause)
        .groupBy(postsTable.id);
      
      switch (sortBy) {
        case 'title':
          query.orderBy(sortDirection === 'asc' ? asc(postsTable.title) : desc(postsTable.title));
          break;
        case 'commentsCount':
          query.orderBy(sortDirection === 'asc' ? asc(count(commentsTable.id)) : desc(count(commentsTable.id)));
          break;
        case 'createdAt':
        default:
          query.orderBy(sortDirection === 'asc' ? asc(postsTable.createdAt) : desc(postsTable.createdAt));
          break;
      }
      
      const posts = await query.limit(limit).offset(offset);

      const totalCountResult = await db
        .select({ count: count() })
        .from(postsTable)
        .where(whereClause);
      
      const total = Number(totalCountResult[0]?.count) || 0;
      
      const page = Math.floor(offset / limit) + 1;
      const totalPages = Math.ceil(total / limit);

      return {
        posts: z.array(PostSchema).parse(posts),
        meta: {
          total,
          limit,
          offset,
          page,
          totalPages
        }
      };
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
