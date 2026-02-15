import { NodePgDatabase } from 'drizzle-orm/node-postgres';

export interface ITransactionManager {
  execute<T>(runnable: (ctx: {
    rollback: () => Promise<void>
    sharedTx: NodePgDatabase
  }) => Promise<T>): Promise<T>
}