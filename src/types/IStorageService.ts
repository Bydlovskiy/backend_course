import { Readable } from 'stream';

export interface IStorageService {
  uploadFile(bucketName: string, key: string, body: Buffer): Promise<void>;
  getFileStream(bucketName: string, key: string) : Promise<Readable>
}