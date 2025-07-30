import { IEntityRepo } from 'src/types/IEntityRepo';
import { Entity } from 'src/types/Entity';

export async function createEntity(params: {
  entityRepo: IEntityRepo;
  data: Partial<Entity>;
}) {
  const entity = await params.entityRepo.createEntity(params.data);

  return entity;
}