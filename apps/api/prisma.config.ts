import { config as loadEnvironment } from 'dotenv';
import { defineConfig } from 'prisma/config';

loadEnvironment({ path: '../../.env', quiet: true });

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url:
      process.env.NODE_ENV === 'test' 
        ? process.env.TEST_DATABASE_URL 
        : (process.env.DATABASE_URL ??
          'postgresql://school:school_dev_password@localhost:5432/school_management?schema=public'),
  },
});
