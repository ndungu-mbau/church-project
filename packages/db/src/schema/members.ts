import {
  pgTable,
  uuid,
  text,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'
import { user } from './auth'

export const members = pgTable('members', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  userId: uuid('user_id').references(() => user.id),
  email: text('email'),
})

export const membersRelations = relations(members, ({ one }) => ({
  user: one(user, { fields: [members.userId], references: [user.id] }),
}))
