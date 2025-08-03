import { eq, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { postsTable } from '../services/drizzle/schemas/schema';
import { IPostRepo } from '../types/repos/IPostRepo';
import { UpdatePostByIdInput } from 'src/api/routes/schemas/post/UpdatePostByIdReqSchema';
import { CreatePostInput } from 'src/api/routes/schemas/post/CreatePostReqSchema';
import { commentsTable } from '../services/drizzle/schemas/schema';
import { GetPostsListRespSchema } from 'src/api/routes/schemas/post/GetPostsListRespSchema';
import { GetPostByIdRespSchema } from 'src/api/routes/schemas/post/GetPostByIdRespSchema';

export function getPostRepo(db: NodePgDatabase): IPostRepo {
  return {
    async createPost(data: CreatePostInput) {
      const post = await db.insert(postsTable).values(data as any).returning();
      return GetPostByIdRespSchema.parse(post[0]);
    },

    async getPostById(id: string) {
      const post = await db
        .select({
          id: postsTable.id,
          title: postsTable.title,
          description: postsTable.description,
          createdAt: postsTable.createdAt,
          updatedAt: postsTable.updatedAt,
          commentsCount: sql<number>`count(${commentsTable.id})::int`
        })
        .from(postsTable)
        .where(eq(postsTable.id, id))
        .leftJoin(commentsTable, eq(postsTable.id, commentsTable.postId))
        .groupBy(postsTable.id);
      
      return post.length > 0 ? GetPostByIdRespSchema.parse(post[0]) : null;
    },

    async getAllPosts() {
      const result = await db
        .select({
          id: postsTable.id,
          title: postsTable.title,
          description: postsTable.description,
          createdAt: postsTable.createdAt,
          updatedAt: postsTable.updatedAt
        })
        .from(postsTable)
        .leftJoin(commentsTable, eq(postsTable.id, commentsTable.postId))
        .groupBy(postsTable.id)
        .orderBy(postsTable.createdAt);

      return result.length > 0 ? GetPostsListRespSchema.parse({ posts: result }) : null;
    },

    async updatePostById(id: string, data: UpdatePostByIdInput) {
      const posts = await db
        .update(postsTable)
        .set(data)
        .where(eq(postsTable.id, id))
        .returning();
      
      return posts.length > 0 ? GetPostByIdRespSchema.parse(posts[0]) : null;
    }
  };
}
