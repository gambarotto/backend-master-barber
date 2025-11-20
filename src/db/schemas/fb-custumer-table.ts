import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const fbCustumers = pgTable('fbcustumers', {
  id: serial('id').primaryKey(),
  id_facebook: varchar('id_facebook').notNull().unique(),
  token: varchar('token').notNull().unique(),
  avatar_url: varchar('avatar_url'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
