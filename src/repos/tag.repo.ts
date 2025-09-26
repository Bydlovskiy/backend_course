import { eq, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { tagsTable } from 'src/services/drizzle/schemas/schema';
import { ITagRepo } from 'src/types/repos/ITagRepo';
import { TagSchema } from 'src/types/tag/ITag';

export function getTagRepo(db: NodePgDatabase): ITagRepo {
  return {
    async createTag(data) {
      const rows = await db
        .insert(tagsTable)
        .values({ name: data.name })
        .returning();
      return TagSchema.parse(rows[0]);
    },

    async getTagById(id) {
      const rows = await db.select().from(tagsTable).where(eq(tagsTable.id, id)).limit(1);
      return rows.length ? TagSchema.parse(rows[0]) : null;
    },

    async getTagByName(name) {
      const rows = await db.select().from(tagsTable).where(eq(tagsTable.name, name)).limit(1);
      return rows.length ? TagSchema.parse(rows[0]) : null;
    },

    async listTags() {
      const tags = await db
        .select()
        .from(tagsTable)
        .orderBy(sql`${tagsTable.name} asc`);

      return tags.map(t => TagSchema.parse(t));
    },

    async updateTag(id, data) {
      const rows = await db
      .update(tagsTable)
      .set({ name: data.name })
      .where(eq(tagsTable.id, id))
      .returning();
      return TagSchema.parse(rows[0]);
    },

    async deleteTag(id) {
      await db.delete(tagsTable).where(eq(tagsTable.id, id));
    }
  };
}
