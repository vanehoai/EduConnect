const { Client } = require('pg');

const dbUrl =
  process.env.DATABASE_URL ||
  'postgresql://postgres:production_secure_password_12345@127.0.0.1:5435/educonnect_production?schema=public';

async function countRecords() {
  const client = new Client({ connectionString: dbUrl });
  try {
    await client.connect();
    const tables = ['User', 'Student', 'Lecturer', 'Course', 'Invoice', 'Exam', 'Announcement'];
    for (const table of tables) {
      const res = await client.query(`SELECT COUNT(*) FROM "${table}"`);
      console.log(`  - Bảng '${table}': ${res.rows[0].count} bản ghi`);
    }
    await client.end();
  } catch (err) {
    console.error('Error counting records:', err.message);
    process.exit(1);
  }
}

countRecords();
