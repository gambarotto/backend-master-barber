import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { stores } from './store-table';
import { avatars } from './avatar-table';
import { schedules } from './schedule-table';

export const employees = pgTable('employees', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  email: varchar('email').notNull().unique(),
  password_hash: varchar('password_hash').notNull(),
  responsibility: varchar('responsibility').notNull(),
  job_id: integer('job_id').references(() => stores.id),
  avatar_id: integer('avatar_id').references(() => avatars.id),
  schedule_id: integer('schedule_id').references(() => schedules.id),
  days_off: integer('days_off').array(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
