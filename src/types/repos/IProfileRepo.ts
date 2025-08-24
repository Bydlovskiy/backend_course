export interface IProfileRepo {
  createProfile(data: { cognitoSub: string; email: string; firstName: string; lastName: string }): Promise<import('src/types/profile/IProfile').Profile>;
  findById(id: string): Promise<import('src/types/profile/IProfile').Profile | null>;
  findByCognitoSub(cognitoSub: string): Promise<import('src/types/profile/IProfile').Profile | null>;
  findByEmail(email: string): Promise<import('src/types/profile/IProfile').Profile | null>;
  updateProfile(id: string, data: Partial<{ email: string; firstName: string; lastName: string }>): Promise<import('src/types/profile/IProfile').Profile | null>;
}