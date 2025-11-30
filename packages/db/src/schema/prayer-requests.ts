import {
  pgTable,
  uuid,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'
import { members } from './members'

export const prayerRequests = pgTable('prayer_requests', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('user_id').references(() => members.id),
  request: text('request'),
  status: text('status'),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).defaultNow(),
})

export const prayerRequestsRelations = relations(prayerRequests, ({ one }) => ({
  user: one(members, {
    fields: [prayerRequests.userId],
    references: [members.id],
  }),
}))
