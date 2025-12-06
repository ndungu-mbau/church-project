import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'
import { user } from './auth'
import { church } from './churches'
import { profiles } from './profiles'

export const staff = pgTable('staff', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('user_id').references(() => user.id),
  email: text('email'),
  position: text('position').notNull(),
  department: text('department'),
  startDate: timestamp('start_date', { withTimezone: true }).notNull(),
  endDate: timestamp('end_date', { withTimezone: true }),
  isActive: boolean('is_active').default(true),
  churchId: uuid('church_id').references(() => church.id),
  profileId: uuid('profile_id').references(() => profiles.id),
})

export const staffRelations = relations(staff, ({ one }) => ({
  user: one(user, { fields: [staff.userId], references: [user.id] }),
  church: one(church, {
    fields: [staff.churchId],
    references: [church.id],
  }),
  profile: one(profiles, {
    fields: [staff.profileId],
    references: [profiles.id],
  }),
}))
