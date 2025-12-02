import { IRepos } from 'src/repos';
import { IUUIDService } from 'src/services/uuid';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { IIdentityService } from 'src/types/IIdentityService';
import { IMailService } from 'src/types/IMailService';
import { IdentityUser } from 'src/types/IdentityUser';
import { IStorageService } from './IStorageService';
import { Profile } from 'src/types/profile/IProfile';
import { ITransactionManager } from './ITransaction';

declare module 'fastify' {
  interface FastifyInstance {
    uuid: IUUIDService;
    db: NodePgDatabase;
    repos: IRepos;
    identityService: IIdentityService,
    mailService: IMailService,
    storageService: IStorageService,
    transaction: ITransactionManager;
  }

  interface FastifyRequest {
    identityUser?: IdentityUser;
    profile?: Profile;
  }

  interface FastifyContextConfig {
    skipAuth?: boolean;
  }
}