import { Tag } from 'src/types/tag/ITag';

export interface ITagRepo {
  createTag(data: { name: string }): Promise<Tag>;
  getTagById(id: string): Promise<Tag | null>;
  getTagByName(name: string): Promise<Tag | null>;
  listTags(): Promise<Tag[]>;
  updateTag(id: string, data: { name: string }): Promise<Tag>;
  deleteTag(id: string): Promise<void>;
}
