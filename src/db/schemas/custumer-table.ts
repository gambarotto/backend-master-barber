import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { fbCustumers } from './fb-custumer-table';
import { avatars } from './avatar-table';

export const custumers = pgTable('custumers', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  email: varchar('email').notNull().unique(),
  password_hash: varchar('password_hash').notNull(),
  id_fb: integer('id_fb').references(() => fbCustumers.id),
  avatar_id: integer('avatar_id').references(() => avatars.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
