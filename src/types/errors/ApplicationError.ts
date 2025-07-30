// All app errors (repose, modules, services) should extend this class
export class ApplicationError extends Error {
  constructor(readonly message: string, readonly cause?: Error | unknown) {
    super(message);
  }
}