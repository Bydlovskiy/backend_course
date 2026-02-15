// import { GetArchivesResSchema } from '../archive/IArchive';
// import { CreateArchiveInput } from '../archive/ICreateArchiveInput';
import { GetHardDeletedUsersRes } from 'src/api/routes/schemas/delete/GetHardDeletedUsersResSchema';

export interface IArchiveRepo {
  getAllArchives(): Promise<GetHardDeletedUsersRes['archives']>;
  getArchiveById(id: string): Promise<any | null>;
  createArchive(data: any): Promise<void>;
  deleteArchive(id: string): Promise<void>;
}
