import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IEntityRepo } from 'src/types/IEntityRepo';
import { Entity, EntitySchema } from 'src/types/Entity';
import { entityTable } from 'src/services/drizzle/schemas/schema';

export function getEntityRepo(db: NodePgDatabase): IEntityRepo {
  return {
    async createEntity(data) {
      const entity = await db.insert(entityTable).values(data as Entity).returning();
      return EntitySchema.parse(entity[0]);
    },
    async updateEntityById(id, data) {
      const entities = await db
        .update(entityTable)
        .set(data as Entity)
        .where(eq(entityTable.id, id))
        .returning();
      return entities.length > 0 ? EntitySchema.parse(entities[0]) : null;
    }
  };
}