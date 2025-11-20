import { drizzle } from 'drizzle-orm/node-postgres';

export const db = drizzle({
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: 'docker',
    database: 'naReguaApp',
    port: 5432,
  },
});

export default db;
