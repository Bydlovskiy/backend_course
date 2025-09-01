import { IIdentityService } from 'src/types/IIdentityService';
import { HttpError } from 'src/api/errors/HttpError';  

export async function getAllUsers(params: {
  identityService: IIdentityService;
  searchQuery?: string;
}) {
  const users = await params.identityService.listUsers({
    searchQuery: params.searchQuery
  });

  if (!users) {
    throw new HttpError(400, 'Users not found');
  }

  return users;
}