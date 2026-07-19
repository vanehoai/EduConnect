const { execSync } = require('child_process');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

if (process.env.NODE_ENV !== 'test') {
  console.warn('Force setting NODE_ENV to test');
  process.env.NODE_ENV = 'test';
}

const testDbUrl = process.env.TEST_DATABASE_URL;
if (!testDbUrl) {
  console.error('TEST_DATABASE_URL is not set.');
  process.exit(1);
}

if (!testDbUrl.includes('_test')) {
  console.error('Safety Check Failed: TEST_DATABASE_URL must end with _test');
  process.exit(1);
}

// Override DATABASE_URL for Prisma
process.env.DATABASE_URL = testDbUrl;

console.log('Running Integration Tests on database:', testDbUrl.split('/').pop().split('?')[0]);

try {
  execSync('npx jest src/modules/exam-attempts/exam-attempts.integration.spec.ts --runInBand', {
    stdio: 'inherit',
    env: process.env,
    cwd: path.join(__dirname, '..'),
  });
} catch (e) {
  console.error('Integration tests failed');
  process.exit(1);
}
