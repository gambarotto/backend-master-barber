import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const schedules = pgTable('schedules', {
  id: serial('id').primaryKey(),
  holiday: text('holiday').array(),
  special: text('special').array(),
  owner_id: integer('owner_id'),
  owner_type: varchar('owner_type'),
  days_week: text('days_week').array(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
