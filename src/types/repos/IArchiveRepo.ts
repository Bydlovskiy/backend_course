export interface ArchivePayload {
  user: any;
  posts: any[];
  comments: any[];
  postTags: any[];
}

export interface IArchiveRepo {
  getAllArchives(): Promise<any[]>;
  getArchiveById(id: string): Promise<any>;
  createArchive(data: any): Promise<void>;
  deleteArchive(id: string): Promise<void>;
}
