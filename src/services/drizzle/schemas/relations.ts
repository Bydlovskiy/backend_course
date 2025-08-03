import { commentsTable, postsTable } from './schema';
import { relations } from 'drizzle-orm';

export const postsRelations = relations(postsTable, ({ many }) => ({
  comments: many(commentsTable)
}));

export const commentsRelations = relations(commentsTable, ({ one }) => ({
  post: one(postsTable, {
    fields: [commentsTable.postId],
    references: [postsTable.id]
  })
}));