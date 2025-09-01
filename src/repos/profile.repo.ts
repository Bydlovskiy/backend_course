import { eq, sql } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { profilesTable } from 'src/services/drizzle/schemas/schema';
import { IProfileRepo } from 'src/types/repos/IProfileRepo';
import { ProfileSchema } from 'src/types/profile/IProfile';

export function getProfileRepo(db: NodePgDatabase): IProfileRepo {
  return {
    async createProfile(data) {
      const rows = await db.insert(profilesTable).values({
        cognitoSub: data.cognitoSub,
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role
      }).returning();
      return ProfileSchema.parse(rows[0]);
    },

    async findByCognitoSub(cognitoSub: string) {
      const rows = await db
        .select()
        .from(profilesTable)
        .where(eq(profilesTable.cognitoSub, cognitoSub))
        .limit(1);
      if (rows.length === 0) {return null;}
      return ProfileSchema.parse(rows[0]);
    },

    async listProfiles(params) {
      const limit = params?.limit ?? 10;
      const offset = params?.offset ?? 0;
      const search = params?.searchQuery?.trim();

      let whereClause: ReturnType<typeof sql> | undefined = undefined as any;
      if (search) {
        const like = `%${search}%`;
        whereClause = sql`(${profilesTable.email} ILIKE ${like} OR ${profilesTable.firstName} ILIKE ${like} OR ${profilesTable.lastName} ILIKE ${like})`;
      }

      const baseQuery = db.select().from(profilesTable);
      if (whereClause) {
        (baseQuery as any).where(whereClause);
      }

      const totalResult = await db
        .select({ count: sql`count(*)` })
        .from(profilesTable)
        .where(whereClause as any);
      const total = Number(totalResult[0]?.count) || 0;

      const rows = await (db
        .select()
        .from(profilesTable)
        .where(whereClause as any)
        .limit(limit)
        .offset(offset));

      const users = rows.map(r => ProfileSchema.parse(r));
      const page = Math.floor(offset / limit) + 1;
      const totalPages = Math.ceil(total / limit);

      return {
        users,
        meta: { total, limit, offset, page, totalPages }
      };
    }
  };
}
