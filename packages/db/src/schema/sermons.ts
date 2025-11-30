import {
  pgTable,
  uuid,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

export const sermons = pgTable('sermons', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  title: text('title'),
  content: text('content'),
  category: text('category'),
  link: text('link'),
  date: timestamp('date', { withTimezone: true }),
})
