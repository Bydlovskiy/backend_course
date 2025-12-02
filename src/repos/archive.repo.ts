import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { archivesTable } from 'src/services/drizzle/schemas/schema';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';

export function getArchiveRepo(db: NodePgDatabase): IArchiveRepo {
  return {
    getAllArchives: async () => {
      return await db.select().from(archivesTable);
    },

    getArchiveById: async (id: string) => {
      return await db.select().from(archivesTable).where(eq(archivesTable.userId, id)).limit(1);
    },

    createArchive: async (data: any) => {
      return await db.insert(archivesTable).values(data);
    },

    deleteArchive: async (id: string) => {
      return await db.delete(archivesTable).where(eq(archivesTable.id, id));
    }
  };
}
