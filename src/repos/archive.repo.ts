import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { archivesTable } from 'src/services/drizzle/schemas/schema';
import { IArchiveRepo } from 'src/types/repos/IArchiveRepo';
// import { CreateArchiveInput } from 'src/types/archive/ICreateArchiveInput';
import { GetHardDeletedUsersResSchema } from 'src/api/routes/schemas/delete/GetHardDeletedUsersResSchema';

export function getArchiveRepo(db: NodePgDatabase): IArchiveRepo {
  return {
    getAllArchives: async () => {
      const result = await db.select().from(archivesTable);
      return GetHardDeletedUsersResSchema.parse({ archives: result }).archives;
    },

    getArchiveById: async (id: string) => {
      const result = await db
        .select()
        .from(archivesTable)
        .where(eq(archivesTable.userId, id))
        .limit(1);

      if (result.length === 0 || !result[0]) {
        return null;
      }
        return result[0];

      // return ArchiveSchema.parse(result[0]);
    },

    createArchive: async (data: any) => {
      return await db.insert(archivesTable).values(data);
    },

    deleteArchive: async (id: string) => {
      return await db.delete(archivesTable).where(eq(archivesTable.id, id));
    }
  };
}
