import {
  pgTable,
  uuid,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'
import { members } from './members'
import { church } from './churches'
import { user } from './auth'

export const prayerRequests = pgTable('prayer_requests', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('user_id').references(() => members.id),
  request: text('request'),
  status: text('status'),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow(),
  churchId: uuid('church_id').references(() => church.id),
  createdBy: uuid('created_by').references(() => user.id),
})

export const prayerRequestsRelations = relations(prayerRequests, ({ one }) => ({
  user: one(members, {
    fields: [prayerRequests.userId],
    references: [members.id],
  }),
  church: one(church, {
    fields: [prayerRequests.churchId],
    references: [church.id],
  }),
  createdBy: one(user, {
    fields: [prayerRequests.createdBy],
    references: [user.id],
  }),
}))
