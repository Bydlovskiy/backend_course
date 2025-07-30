import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle-out',
  schema: './src/services/drizzle/schema.ts',
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: {
    host: process.env.PGHOST!,
    port: parseInt(process.env.PGPORT!),
    password: process.env.PGPASSWORD!,
    user: process.env.PGUSERNAME!,
    database: process.env.PGDATABASE!,
    ssl: false
  }
});