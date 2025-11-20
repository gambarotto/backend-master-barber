import { integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';
// eslint-disable-next-line import/no-unresolved
import { stores } from './store-table';
// eslint-disable-next-line import/no-unresolved
import { custumers } from './custumer-table';

export const couponCustumers = pgTable('coupons_custumers', {
  id: serial('id').primaryKey(),
  store_id: integer('store_id')
    .references(() => stores.id)
    .notNull(),
  custumer_id: integer('custumer_id')
    .references(() => custumers.id)
    .notNull(),
  coupons: integer('coupons').notNull(),
  tikets: integer('tikets').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
