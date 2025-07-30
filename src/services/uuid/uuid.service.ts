import { randomUUID } from 'crypto';

export interface IUUIDService {
  getUUID(): string;
}

export function getUUIDService(): IUUIDService {
  return {
    getUUID() {
      return randomUUID();
    }
  };
}