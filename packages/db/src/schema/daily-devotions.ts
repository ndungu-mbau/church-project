import {
  pgTable,
  uuid,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'
import { church } from './churches'
import { user } from './auth'

export const dailyDevotions = pgTable('daily_devotions', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  title: text('title'),
  content: text('content'),
  date: timestamp('date', { withTimezone: true }),
  link: text('link'),
  churchId: uuid('church_id').references(() => church.id),
  createdBy: uuid('created_by').references(() => user.id),
})

export const dailyDevotionsRelations = relations(dailyDevotions, ({ one }) => ({
  church: one(church, {
    fields: [dailyDevotions.churchId],
    references: [church.id],
  }),
  createdBy: one(user, {
    fields: [dailyDevotions.createdBy],
    references: [user.id],
  }),
}))
