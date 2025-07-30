import { Entity } from './Entity';

export interface IEntityRepo {
  createEntity(data: Partial<Entity>): Promise<Entity>;
  updateEntityById(id: string, data: Partial<Entity>): Promise<Entity | null>;
}