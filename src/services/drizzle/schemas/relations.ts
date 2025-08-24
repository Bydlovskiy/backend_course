import { commentsTable, postsTable, profilesTable } from './schema';
import { relations } from 'drizzle-orm';

export const postsRelations = relations(postsTable, ({ many }) => ({
  comments: many(commentsTable)
}));

export const commentsRelations = relations(commentsTable, ({ one }) => ({
  post: one(postsTable, {
    fields: [commentsTable.postId],
    references: [postsTable.id]
  }),
  author: one(profilesTable, {
    fields: [commentsTable.authorId],
    references: [profilesTable.id]
  })
}));

export const postsAuthorRelations = relations(postsTable, ({ one }) => ({
  author: one(profilesTable, {
    fields: [postsTable.authorId],
    references: [profilesTable.id]
  })
}));