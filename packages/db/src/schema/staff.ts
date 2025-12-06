import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'
import { user } from './auth'
import { profiles } from './profiles'
import { church } from './churches'

export const staff = pgTable('staff', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('user_id').references(() => user.id),
  email: text('email'),
  position: text('position').notNull(),
  department: text('department'),
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true }),
  isActive: boolean('is_active').default(true),
  profileId: uuid('profile_id').references(() => profiles.id),
  churchId: uuid('church_id').references(() => church.id),
})

export const staffRelations = relations(staff, ({ one }) => ({
  user: one(user, { fields: [staff.userId], references: [user.id] }),
  profile: one(profiles, {
    fields: [staff.profileId],
    references: [profiles.id],
  }),
  church: one(church, {
    fields: [staff.churchId],
    references: [church.id],
  }),
}))
