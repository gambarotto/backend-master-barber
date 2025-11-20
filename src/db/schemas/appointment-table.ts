import {
  boolean,
  integer,
  pgTable,
  serial,
  timestamp,
} from 'drizzle-orm/pg-core';
// eslint-disable-next-line import/no-unresolved
import { employees } from './employee-table';
// eslint-disable-next-line import/no-unresolved
import { stores } from './store-table';
// eslint-disable-next-line import/no-unresolved
import { custumers } from './custumer-table';

export const appointments = pgTable('appointments', {
  id: serial('id').primaryKey(),
  date: timestamp('date').notNull(),
  employee_id: integer('employee_id')
    .references(() => employees.id)
    .notNull(),
  store_id: integer('store_id')
    .references(() => stores.id)
    .notNull(),
  custumer_id: integer('custumer_id')
    .references(() => custumers.id)
    .notNull(),
  canceled_at: timestamp('canceled_at'),
  validated: boolean('validated'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
