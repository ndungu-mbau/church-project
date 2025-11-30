import {
  pgTable,
  uuid,
  timestamp,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'
import { events } from './events'
import { user } from './auth'

export const eventRegistrations = pgTable('event_registrations', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  eventId: uuid('event_id').references(() => events.id),
  userId: uuid('user_id').references(() => user.id),
  registeredAt: timestamp('registered_at', { withTimezone: true }).defaultNow(),
})

export const eventRegistrationsRelations = relations(
  eventRegistrations,
  ({ one }) => ({
    event: one(events, {
      fields: [eventRegistrations.eventId],
      references: [events.id],
    }),
    user: one(user, {
      fields: [eventRegistrations.userId],
      references: [user.id],
    }),
  }),
)
