import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { commentsTable } from '../services/drizzle/schemas/schema';
import { ICommentRepo } from '../types/repos/ICommentRepo';
import { CreateCommentResSchema } from 'src/api/routes/schemas/comment/CreateCommentResSchema';
import { UpdateCommentByIdInput } from 'src/api/routes/schemas/comment/UpdateCommentByIdReqSchema';

export function getCommentRepo(db: NodePgDatabase): ICommentRepo {
  return {
    async createComment(data: { text: string, postId: string }) {
      const comment = await db.insert(commentsTable).values({
        text: data.text,
        postId: data.postId
      }).returning();
      return CreateCommentResSchema.parse(comment[0]);
    },

    async getCommentsByPostId(postId: string) {
      const comments = await db
        .select()
        .from(commentsTable)
        .where(eq(commentsTable.postId, postId))
        .orderBy(commentsTable.createdAt);
      
      return comments.map(comment => CreateCommentResSchema.parse(comment));
    },

    async updateCommentById(id: string, data: UpdateCommentByIdInput) {
      const comments = await db
        .update(commentsTable)
        .set(data)
        .where(eq(commentsTable.id, id))
        .returning();
      
      return comments.length > 0 ? CreateCommentResSchema.parse(comments[0]) : null;
    }
  };
}
