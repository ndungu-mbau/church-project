import {
  pgTable,
  uuid,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'
import { groups } from './groups'
import { user } from './auth'

export const groupMembers = pgTable('group_members', {
  id: uuid('id').primaryKey().notNull().defaultRandom(),
  groupId: uuid('group_id').references(() => groups.id),
  userId: uuid('user_id').references(() => user.id),
})

export const groupMembersRelations = relations(groupMembers, ({ one }) => ({
  group: one(groups, {
    fields: [groupMembers.groupId],
    references: [groups.id],
  }),
  user: one(user, {
    fields: [groupMembers.userId],
    references: [user.id],
  }),
}))
