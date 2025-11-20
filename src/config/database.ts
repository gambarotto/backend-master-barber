import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from '../database/schema';

const pool = new Pool({
  host: 'localhost',
  user: 'postgres',
  password: 'docker',
  database: 'naReguaApp',
  port: 5432,
});

export const db = drizzle();

export default db;
