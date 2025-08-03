import { IPostRepo } from 'src/types/repos/IPostRepo';

export async function getAllPosts(params: {
  postRepo: IPostRepo;
}) {
  const posts = await params.postRepo.getAllPosts();

  if (!posts) {
    throw new Error('Posts not found');
  }

  return posts;
}