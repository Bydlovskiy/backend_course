import { ITagRepo } from 'src/types/repos/ITagRepo';

export async function listTags(params: { tagRepo: ITagRepo; search?: string; }) {
  return await params.tagRepo.listTags();
}
