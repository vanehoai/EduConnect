import { config as loadEnvironment } from 'dotenv';
import { defineConfig } from 'prisma/config';

loadEnvironment({ path: '../../.env', quiet: true });

const isTestEnvironment = process.env.NODE_ENV === 'test';

const databaseUrl = isTestEnvironment ? process.env.TEST_DATABASE_URL : process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    isTestEnvironment
      ? 'TEST_DATABASE_URL is required when NODE_ENV=test'
      : 'DATABASE_URL is required',
  );
}

if (isTestEnvironment) {
  const databaseName = new URL(databaseUrl).pathname.replace(/^\//, '');

  if (!databaseName.endsWith('_test')) {
    throw new Error('TEST_DATABASE_URL must point to a database whose name ends with _test');
  }
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: databaseUrl,
  },
});
