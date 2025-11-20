import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { stores } from './store-table';
import { avatars } from './avatar-table';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  email: varchar('email').notNull().unique(),
  password_hash: varchar('password_hash').notNull(),
  provider: boolean('provider').notNull().default(false).$type<boolean>(),
  store_id: integer('store_id').references(() => stores.id),
  avatar_id: integer('avatar_id').references(() => avatars.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
