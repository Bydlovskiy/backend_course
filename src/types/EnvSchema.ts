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
  COGNITO_CLIENT_ID: z.string(),
  // Optional integrations
  KMS_KEY_ID: z.string(),
  AWS_REGION: z.string(),
  SENDGRID_API_KEY: z.string(),
  SENDGRID_FROM_EMAIL: z.string().email(),
  SENDGRID_TEMPLATE_INVITE_ID: z.string(),
  INVITE_SECRET: z.string().optional(),
  FRONTEND_URL: z.string().url(),
  RESEND_API_KEY: z.string(),
  RESEND_FROM_EMAIL: z.string().email()
});

export type Env = z.infer<typeof EnvSchema>;