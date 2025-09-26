import { ITagRepo } from 'src/types/repos/ITagRepo';

export async function deleteTag(params: { tagRepo: ITagRepo; tagId: string }): Promise<void> {
  await params.tagRepo.deleteTag(params.tagId);
}
