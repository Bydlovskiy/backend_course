import { uuid, pgTable, varchar, timestamp, text, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const profilesTable = pgTable('profiles', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  cognitoSub: varchar({ length: 64 }).notNull().unique(),
  email: varchar({ length: 255 }).notNull().unique(),
  firstName: varchar({ length: 255 }).notNull(),
  lastName: varchar({ length: 255 }).notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date())
});

export const postsTable = pgTable('posts', {
  id: uuid().primaryKey().default(sql`uuid_generate_v4()`),
  title: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
  authorId: uuid().notNull().references(() => profilesTable.id),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date())
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
  updatedAt: timestamp().defaultNow().$onUpdate(() => new Date())
});

