import { GetHardDeletedUsersRes } from 'src/api/routes/schemas/delete/GetHardDeletedUsersResSchema';
import { GetHardDeletedReq } from 'src/types/delete/GetHardDeletedArchiveSchema';

export interface IArchiveRepo {
  getAllArchives(): Promise<GetHardDeletedUsersRes['archives']>;
  getArchiveById(id: string): Promise<GetHardDeletedReq | null>;
  createArchive(data: any): Promise<void>;
  deleteArchive(id: string): Promise<void>;
}
