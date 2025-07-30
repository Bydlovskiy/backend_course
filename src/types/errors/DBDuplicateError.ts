import { ApplicationError } from './ApplicationError';

export class DBDuplicateError extends ApplicationError {
  constructor(entity: string, cause?: Error) {
    super(`Duplicate in ${entity}`, cause);
  }
}