export interface IProfileRepo {
  createProfile(data: { cognitoSub: string; email: string; firstName: string; lastName: string }): Promise<import('src/types/profile/IProfile').Profile>;
  findByCognitoSub(cognitoSub: string): Promise<import('src/types/profile/IProfile').Profile | null>;
}