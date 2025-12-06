import {
  pgTable,
  uuid,
  text,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'
import { user } from './auth'
import { church } from './churches'

export const groups = pgTable('groups', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  name: text('name'),
  leaderId: uuid('leader_id').references(() => user.id),
  description: text('description'),
  churchId: uuid('church_id').references(() => church.id),
  createdBy: uuid('created_by').references(() => user.id),
})

export const groupsRelations = relations(groups, ({ one }) => ({
  leader: one(user, {
    fields: [groups.leaderId],
    references: [user.id],
  }),
  church: one(church, {
    fields: [groups.churchId],
    references: [church.id],
  }),
  createdBy: one(user, {
    fields: [groups.createdBy],
    references: [user.id],
  }),
}))
