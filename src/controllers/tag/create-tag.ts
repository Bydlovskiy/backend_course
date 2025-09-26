import { ITagRepo } from 'src/types/repos/ITagRepo';
import { Tag } from 'src/types/tag/ITag';

export async function createTag(params: { tagRepo: ITagRepo; name: string }): Promise<Tag> {
  return await params.tagRepo.createTag({ name: params.name });
}
