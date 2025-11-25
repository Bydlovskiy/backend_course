import { uuid, pgTable, varchar, timestamp, text, index, primaryKey } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const profilesTable = pgTable('profiles', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  email: varchar({ length: 255 }).notNull().unique(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }).notNull(),
  role: varchar({ length: 64 }),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date()),
  activatedAt: timestamp(),
  deletedAt: timestamp()
});

export const postsTable = pgTable('posts', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
  authorId: uuid().notNull().references(() => profilesTable.id),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp()
}, (t) => [
  index('posts_title_idx').using('gin', sql`${t.title} gin_trgm_ops`),
  index('posts_description_idx').using('gin', sql`${t.description} gin_trgm_ops`)
]);

export const commentsTable = pgTable('comments', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  postId: uuid().notNull().references(() => postsTable.id),
  authorId: uuid().notNull().references(() => profilesTable.id),
  text: text().notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date()),
  deletedAt: timestamp()
});

// Tags: many-to-many with posts via post_tags
export const tagsTable = pgTable('tags', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  name: varchar({ length: 64 }).notNull().unique(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date())
});

export const postTagsTable = pgTable('post_tags', {
  postId: uuid().notNull().references(() => postsTable.id, { onDelete: 'cascade' }),
  tagId: uuid().notNull().references(() => tagsTable.id, { onDelete: 'cascade' })
}, (t) => [
  primaryKey({ columns: [t.postId, t.tagId], name: 'post_tags_pk' }),
  index('post_tags_post_idx').on(t.postId),
  index('post_tags_tag_idx').on(t.tagId)
]);
