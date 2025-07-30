import type { Env } from './EnvSchema';

// Here we all env vars
declare global {
  namespace NodeJS {
    interface ProcessEnv extends Env {}
  }
}