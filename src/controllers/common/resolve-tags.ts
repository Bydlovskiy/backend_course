import { ITagRepo } from 'src/types/repos/ITagRepo';
import { HttpError } from 'src/api/errors/HttpError';

export type IncomingTag = { id?: string; name: string };

export async function resolveExistingTagIds(params: {
  tagRepo: ITagRepo;
  tags?: IncomingTag[] | null | undefined;
}): Promise<string[]> {
  const { tagRepo } = params;
  const tags = Array.isArray(params.tags) ? params.tags : [];
  if (tags.length === 0) {return [];}

  const ids: string[] = [];
  for (const t of tags) {
    if (t.id) {
      ids.push(t.id);
      continue;
    }
    const existing = await tagRepo.getTagByName(t.name);
    if (!existing) {
      throw new HttpError(400, `Tag not found: ${t.name}`);
    }
    ids.push(existing.id);
  }

  const seen = new Set<string>();
  const unique = ids.filter(id => (seen.has(id) ? false : (seen.add(id), true)));
  return unique;
}

export async function resolveFilterTagIds(params: {
  tagRepo: ITagRepo;
  tags?: IncomingTag[] | null | undefined;
}): Promise<string[]> {
  const { tagRepo } = params;
  const tags = Array.isArray(params.tags) ? params.tags : [];
  if (tags.length === 0) {return [];}
  const ids: string[] = [];
  for (const t of tags) {
    if (t.id) {
      ids.push(t.id);
      continue;
    }
    const existing = await tagRepo.getTagByName(t.name);
    if (existing) {ids.push(existing.id);}
  }
  return Array.from(new Set(ids));
}
