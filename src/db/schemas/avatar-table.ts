import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const avatars = pgTable('avatars', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  path: varchar('path').notNull().unique(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
