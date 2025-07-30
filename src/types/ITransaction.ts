export interface ITransactionManager {
  execute<T>(runnable: (ctx: {
    rollback: () => Promise<void>
    sharedTx: unknown
  }) => Promise<T>): Promise<T>
}