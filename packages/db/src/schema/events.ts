import {
  pgTable,
  uuid,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'
import { user } from './auth'
import { church } from './churches'

export const events = pgTable('events', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: text('name'),
  description: text('description'),
  startTime: timestamp('start_time', { withTimezone: true }),
  endTime: timestamp('end_time', { withTimezone: true }),
  location: text('location'),
  createdBy: uuid('created_by').references(() => user.id),
  churchId: uuid('church_id').references(() => church.id),
})

export const eventsRelations = relations(events, ({ one }) => ({
  church: one(church, {
    fields: [events.churchId],
    references: [church.id],
  }),
  createdBy: one(user, {
    fields: [events.createdBy],
    references: [user.id],
  }),
}))

