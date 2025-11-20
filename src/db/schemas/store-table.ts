import {
  integer,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import { addresses } from './address-table';
import { images } from './image-table';
import { schedules } from './schedule-table';
import { ratingStores } from './rating-stores-table';

export const stores = pgTable('stores', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  email: varchar('email').unique(),
  cnpj: varchar('cnpj').notNull().unique(),
  tel: varchar('tel'),
  address_id: integer('address_id').references(() => addresses.id),
  facebook_url: varchar('facebook_url'),
  instagram_url: varchar('instagram_url'),
  image_id: integer('image_id').references(() => images.id),
  schedule_id: integer('schedule_id').references(() => schedules.id),
  rating_id: integer('rating_id').references(() => ratingStores.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
