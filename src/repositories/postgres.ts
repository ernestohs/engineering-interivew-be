import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST || 'localhost',
  database: process.env.DATABASE_NAME,
  port: 5432,
});
export default pool;
