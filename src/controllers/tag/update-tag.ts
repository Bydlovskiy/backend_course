import { ITagRepo } from 'src/types/repos/ITagRepo';
import { Tag } from 'src/types/tag/ITag';

export async function updateTag(
  params: { tagRepo: ITagRepo; tagId: string; name: string }
): Promise<Tag> {
  return await params.tagRepo.updateTag(params.tagId, { name: params.name });
}
