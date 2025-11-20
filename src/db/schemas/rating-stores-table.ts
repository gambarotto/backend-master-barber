import {
  doublePrecision,
  integer,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';

export const ratingStores = pgTable('rating_stores', {
  id: serial('id').primaryKey(),
  qty: integer('qty'),
  rating: doublePrecision('rating'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
