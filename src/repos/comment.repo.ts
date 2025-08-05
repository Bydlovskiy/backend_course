import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CommentSchema } from '../types/IComment';
import { commentsTable } from '../services/drizzle/schemas/schema';
import { ICommentRepo } from '../types/repos/ICommentRepo';

import { UpdateCommentByIdInput } from 'src/api/routes/schemas/comment/UpdateCommentByIdReqSchema';

export function getCommentRepo(db: NodePgDatabase): ICommentRepo {
  return {
    async createComment(data: { text: string, postId: string }) {
      const comment = await db.insert(commentsTable).values({
        text: data.text,
        postId: data.postId
      }).returning();
      return CommentSchema.parse(comment[0]);
    },

    async getCommentsByPostId(postId: string) {
      const comments = await db
        .select()
        .from(commentsTable)
        .where(eq(commentsTable.postId, postId))
        .orderBy(commentsTable.createdAt);
      
      return comments.map(comment => CommentSchema.parse(comment));
    },

    async updateCommentById(id: string, data: UpdateCommentByIdInput) {
      const comments = await db
        .update(commentsTable)
        .set(data)
        .where(eq(commentsTable.id, id))
        .returning();
      
      return comments.length > 0 ? CommentSchema.parse(comments[0]) : null;
    }
  };
}
