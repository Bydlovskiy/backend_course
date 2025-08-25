import { eq } from 'drizzle-orm';
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
        lastName: data.lastName
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
    }
  };
}

