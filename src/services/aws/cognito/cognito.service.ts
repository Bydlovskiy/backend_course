import { IIdentityService } from 'src/types/IIdentityService';
import { ApplicationError } from 'src/types/errors/ApplicationError';
import * as AWS from '@aws-sdk/client-cognito-identity-provider';
import { IdentityUserSchema } from 'src/types/IdentityUser';
import { HttpError } from 'src/api/errors/HttpError';
import { EErrorCodes } from 'src/api/errors/EErrorCodes';

export function getAWSCognitoService(region: string): IIdentityService {
  const client = new AWS.CognitoIdentityProvider({
    region
  });

  function mapAttributes(attributes?: AWS.AttributeType[] | undefined) {
    const map = (attributes || []).reduce<Record<string, string>>((acc, a) => {
      if (a.Name && a.Value !== undefined) {acc[a.Name] = a.Value;}
      return acc;
    }, {});
    return map;
  }

  return {
    async getUserByEmail(email: string) {
      try {
        const user = await client.adminGetUser({
          UserPoolId: process.env.COGNITO_USER_POOL_ID!,
          Username: email
        });

        const attributesMap = mapAttributes(user.UserAttributes);

        return IdentityUserSchema.parse({
          email: attributesMap.email || '',
          firstName: attributesMap.name || undefined,
          lastName: attributesMap.family_name || undefined,
          emailVerified: attributesMap.email_verified === 'true',
          isEnabled: user.Enabled,
          mfaEnabled: !!user.UserMFASettingList
        });
      } catch (err) {
        throw new ApplicationError(`Cognito error - ${err}`);
      }
    },

    async getUserByAccessToken(token) {
      try {
        const user = await client.getUser({
          AccessToken: token
        });

        const rawUserData = mapAttributes(user.UserAttributes);
        const subId = rawUserData.sub;
        const email = rawUserData.email;

        let isEnabled: boolean | undefined;
        let firstName: string | undefined;
        let lastName: string | undefined;
        let emailVerified: boolean | undefined;
        let mfaEnabled: boolean | undefined;
        try {
          const adminUser = await client.adminGetUser({
            UserPoolId: process.env.COGNITO_USER_POOL_ID!,
            Username: subId!
          });
          const att = mapAttributes(adminUser.UserAttributes);
          isEnabled = adminUser.Enabled;
          firstName = att.name || undefined;
          lastName = att.family_name || undefined;
          emailVerified = att.email_verified === 'true';
          mfaEnabled = !!adminUser.UserMFASettingList;
        } catch (_) {
          // ignore enrichment failures
        }

        return IdentityUserSchema.parse({
          email: email!,
          firstName,
          lastName,
          emailVerified,
          isEnabled,
          mfaEnabled
        });
      } catch (err) {
        throw new ApplicationError(`Cognito error - ${err}`);
      }
    },

    async createUser(email, firstName, lastName) {
      try {
        const result = await client.adminCreateUser({
          Username: email,
          UserAttributes: [
            { Name: 'email', Value: email },
            { Name: 'name', Value: firstName },
            { Name: 'family_name', Value: lastName },
            { Name: 'email_verified', Value: 'true' }
          ],
          UserPoolId: process.env.COGNITO_USER_POOL_ID!,
          MessageAction: 'SUPPRESS'
        });

        const att = result.User?.Attributes?.find(a => a.Name === 'sub');
        return { subId: att?.Value as string, email };
      } catch (err) {
        if (err instanceof AWS.UsernameExistsException) {
          throw new HttpError(400, 'Cognito error', err as any, EErrorCodes.EMAIL_USED);
        }

        throw new ApplicationError(`Cognito error - ${err}`);
      }
    },

    async updateUser(subId, firstName, lastName) {
      try {
        await client.adminUpdateUserAttributes({
          UserPoolId: process.env.COGNITO_USER_POOL_ID!,
          Username: subId,
          UserAttributes: [
            { Name: 'name', Value: firstName },
            { Name: 'family_name', Value: lastName }
          ]
        });

        return true;
      } catch (err) {
        throw new ApplicationError(`Cognito error - ${err}`);
      }
    },

    async setPassword(email, password) {
      try {
        await client.adminSetUserPassword({
          UserPoolId: process.env.COGNITO_USER_POOL_ID!,
          Username: email,
          Password: password,
          Permanent: true
        });
      } catch (err) {
        throw new ApplicationError(`Cognito error - ${err}`);
      }
    },

    async listUsers(params) {
      try {
        const res = await client.listUsers({
          UserPoolId: process.env.COGNITO_USER_POOL_ID!,
          Filter: params?.searchQuery ? `name ^= "${params.searchQuery}"` : undefined
        });

        const users = (res.Users || []).map(u => {
          const att = mapAttributes(u.Attributes);
          return IdentityUserSchema.parse({
            email: att.email || '',
            firstName: att.name || undefined,
            lastName: att.family_name || undefined,
            emailVerified: att.email_verified === 'true',
            isEnabled: u.Enabled,
            mfaEnabled: !!u.MFAOptions,
            status: u.UserStatus
          });
        });

        return {
          users,
          paginationToken: res.PaginationToken
        };
      } catch (err) {
        throw new ApplicationError(`Cognito error - ${err}`);
      }
    },

    async deactivateUser(email: string) {
      try {
        await client.adminDisableUser({
          UserPoolId: process.env.COGNITO_USER_POOL_ID!,
          Username: email
        });
      } catch (err) {
        throw new ApplicationError(`Cognito error - ${err}`);
      }
    },

    async activateUser(email: string) {
      try {
        await client.adminEnableUser({
          UserPoolId: process.env.COGNITO_USER_POOL_ID!,
          Username: email
        });
      } catch (err) {
        throw new ApplicationError(`Cognito error - ${err}`);
      }
    }
  };
}

export const identityService = getAWSCognitoService(
  process.env.COGNITO_REGION as string
);