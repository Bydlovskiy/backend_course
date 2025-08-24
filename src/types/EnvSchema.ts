import { z } from 'zod';

// DONT USE transform here
// because we are not overwriting process.env
export const EnvSchema = z.object({
  TZ: z.string().optional(),
  NODE_ENV: z.enum(['local', 'staging', 'production']),
  PORT: z.string(),
  HOST: z.string(),
  PGHOST: z.string(),
  PGPORT: z.string(),
  PGUSERNAME: z.string(),
  PGPASSWORD: z.string(),
  PGDATABASE: z.string(),
  SWAGGER_USER: z.string(),
  SWAGGER_PWD: z.string().min(10),
  COGNITO_REGION: z.string(),
  COGNITO_USER_POOL_ID: z.string(),
  COGNITO_CLIENT_ID: z.string()
});

export type Env = z.infer<typeof EnvSchema>;