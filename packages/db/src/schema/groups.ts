import {
  pgTable,
  uuid,
  text,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'
import { user } from './auth'

export const groups = pgTable('groups', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: text('name'),
  leaderId: uuid('leader_id').references(() => user.id),
  description: text('description'),
})

export const groupsRelations = relations(groups, ({ one }) => ({
  leader: one(user, {
    fields: [groups.leaderId],
    references: [user.id],
  }),
}))
