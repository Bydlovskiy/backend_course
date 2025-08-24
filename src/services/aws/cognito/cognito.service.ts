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

  return {
    async getUserBySubId(subId) {
      try {
        const user = await client.adminGetUser({
          UserPoolId: process.env.COGNITO_USER_POOL_ID,
          Username: subId
        });

        const attributesMap = user.UserAttributes?.reduce<Record<string, string>>((map, attr) => {
          if (attr.Name && attr.Value !== undefined) {
            map[attr.Name] = attr.Value;
          }
          return map;
        }, {}) || {};

        return IdentityUserSchema.parse({
          subId: user.Username!,
          email: attributesMap.email || '',
          firstName: attributesMap.name || '',
          lastName: attributesMap.family_name || '',
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

        const rawUserData = user.UserAttributes?.
        reduce<Record<string, string | null>>((acc, attribute) => {
          if (attribute.Name) {
            return { ...acc, [attribute.Name]: attribute.Value || null };
          }

          return acc;
        }, {});

        return IdentityUserSchema.parse({
          subId: rawUserData!.sub,
          email: rawUserData!.email
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
          UserPoolId: process.env.COGNITO_USER_POOL_ID,
          MessageAction: 'SUPPRESS'
        });

        const att = result.User?.Attributes?.find(a => a.Name === 'sub');
        return { subId: att?.Value as string, email };
      } catch (err) {
        if (err instanceof AWS.UsernameExistsException) {
          throw new HttpError(400, 'Cognito error', err, EErrorCodes.EMAIL_USED);
        }

        throw new ApplicationError(`Cognito error - ${err}`);
      }
    },

    async updateUser(subId, firstName, lastName) {
      try {
        await client.adminUpdateUserAttributes({
          UserPoolId: process.env.COGNITO_USER_POOL_ID,
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

    async setPassword(subId, password) {
      try {
        await client.adminSetUserPassword({
          UserPoolId: process.env.COGNITO_USER_POOL_ID,
          Username: subId,
          Password: password,
          Permanent: true
        });
      } catch (err) {
        throw new ApplicationError(`Cognito error - ${err}`);
      }
    }
  };
}

export const identityService = getAWSCognitoService(
  process.env.COGNITO_REGION
);