import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
import { stores } from './store-table';
import { custumers } from './custumer-table';

export const avaliations = pgTable('avaliations', {
  id: serial('id').primaryKey(),
  store_id: integer('store_id')
    .references(() => stores.id)
    .notNull(),
  custumer_id: integer('custumer_id')
    .references(() => custumers.id)
    .notNull(),
  rating: integer('rating').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
