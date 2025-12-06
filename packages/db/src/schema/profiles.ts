import {
  pgTable,
  uuid,
  text,
  timestamp,
  date,
  boolean,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'
import { user } from './auth'
import { church } from './churches'

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('user_id').unique().references(() => user.id, { onDelete: 'set null' }),
  phone: text("phone").unique(),
  phoneVerified: boolean("phone_verified").default(false).notNull(),
  bio: text('bio'),
  address: text('address'),
  city: text('city'),
  state: text('state'),
  country: text('country'),
  postalCode: text('postal_code'),
  dateOfBirth: date('date_of_birth'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  churchId: uuid('church_id').references(() => church.id),
})

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(user, {
    fields: [profiles.userId],
    references: [user.id],
  }),
  church: one(church, {
    fields: [profiles.churchId],
    references: [church.id],
  }),
}))
