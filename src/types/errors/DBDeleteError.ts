import { ApplicationError } from './ApplicationError';

export class DBDeleteError extends ApplicationError {
  constructor(message: string, cause?: Error | unknown) {
    super(message, cause);
  }
}