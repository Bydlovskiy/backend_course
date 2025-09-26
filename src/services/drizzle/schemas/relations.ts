import { commentsTable, postsTable, profilesTable, tagsTable, postTagsTable } from './schema';
import { relations } from 'drizzle-orm';

export const postsRelations = relations(postsTable, ({ many, one }) => ({
  author: one(profilesTable, {
    fields: [postsTable.authorId],
    references: [profilesTable.id]
  }),
  comments: many(commentsTable),
  postTags: many(postTagsTable)
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

export const tagsRelations = relations(tagsTable, ({ many }) => ({
  postTags: many(postTagsTable)
}));

export const postTagsRelations = relations(postTagsTable, ({ one }) => ({
  post: one(postsTable, {
    fields: [postTagsTable.postId],
    references: [postsTable.id]
  }),
  tag: one(tagsTable, {
    fields: [postTagsTable.tagId],
    references: [tagsTable.id]
  })
}));