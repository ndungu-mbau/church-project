import {
  pgTable,
  uuid,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { user } from './auth'

export const events = pgTable('events', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: text('name'),
  description: text('description'),
  startTime: timestamp('start_time', { withTimezone: true }),
  endTime: timestamp('end_time', { withTimezone: true }),
  location: text('location'),
  createdBy: uuid('created_by').references(() => user.id),
})

