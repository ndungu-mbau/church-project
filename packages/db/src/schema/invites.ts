import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
} from 'drizzle-orm/pg-core'

export const roles = pgEnum('roles', ['admin', 'editor', 'user'])

export const invites = pgTable('invites', {
  id: uuid('uuid4').notNull().defaultRandom().primaryKey(),
  email: text('email').notNull(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})

export type NewInvite = typeof invites.$inferInsert
