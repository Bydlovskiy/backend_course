import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { CommentSchema } from 'src/types/comment/IComment';
import { ProfileSchema } from 'src/types/profile/IProfile';
import { commentsTable } from 'src/services/drizzle/schemas/schema';
import { profilesTable } from 'src/services/drizzle/schemas/schema';
import { ICommentRepo } from 'src/types/repos/ICommentRepo';

import { UpdateCommentByIdInput } from 'src/types/comment/IUpdateCommentByIdInput';

export function getCommentRepo(db: NodePgDatabase): ICommentRepo {
  async function fetchCommentWithAuthor(id: string) {
    const rows = await db
      .select({
        comment: commentsTable,
        author: profilesTable
      })
      .from(commentsTable)
      .innerJoin(profilesTable, eq(commentsTable.authorId, profilesTable.id))
      .where(eq(commentsTable.id, id));

    if (rows.length === 0) {
      return null;
    }

    const { comment, author } = rows[0];
    return {
      ...CommentSchema.parse(comment),
      author: ProfileSchema.parse(author)
    } as any;
  }

  return {
    async createComment(data: { text: string, postId: string, authorId: string }) {
      const inserted = await db.insert(commentsTable).values({
        text: data.text,
        postId: data.postId,
        authorId: data.authorId
      }).returning();
      return await fetchCommentWithAuthor(inserted[0].id);
    },

    async getCommentById(id: string) {
      return await fetchCommentWithAuthor(id);
    },

    async getCommentsByPostId(postId: string) {
      const rows = await db
        .select({
          comment: commentsTable,
          author: profilesTable
        })
        .from(commentsTable)
        .innerJoin(profilesTable, eq(commentsTable.authorId, profilesTable.id))
        .where(eq(commentsTable.postId, postId))
        .orderBy(commentsTable.createdAt);

      return rows.map(({ comment, author }) => ({
        ...CommentSchema.parse(comment),
        author: ProfileSchema.parse(author)
      }));
    },

    async updateCommentById(id: string, data: UpdateCommentByIdInput) {
      const updated = await db
        .update(commentsTable)
        .set(data)
        .where(eq(commentsTable.id, id))
        .returning();
      
      if (updated.length === 0) {
        return null;
      }
      return await fetchCommentWithAuthor(updated[0].id);
    }
  };
}
