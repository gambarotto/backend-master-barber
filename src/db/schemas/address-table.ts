import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const addresses = pgTable('addresses', {
  id: serial('id').primaryKey(),
  street: varchar('street').notNull(),
  number: varchar('number').notNull(),
  complement: varchar('complement'),
  state: varchar('state').notNull(),
  city: varchar('city').notNull(),
  zipcode: varchar('zipcode').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});
