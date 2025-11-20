import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
// eslint-disable-next-line import/no-unresolved
import { stores } from './store-table';

export const services = pgTable('services', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  price: varchar('price'),
  store_id: integer('store_id').references(() => stores.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
