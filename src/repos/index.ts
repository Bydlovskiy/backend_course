import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { getEntityRepo } from './entity.repo';

export function getRepos(db: NodePgDatabase) {
  return {
    entityRepo: getEntityRepo(db)
  };
}

export type IRepos = ReturnType<typeof getRepos>;