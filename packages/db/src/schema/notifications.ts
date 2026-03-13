import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm/relations'
import { user } from './auth'
import { church } from './churches'
import { groups } from './groups'
import { events } from './events'
import { members } from './members'

// Enums for notification type and status
export const notificationTypeEnum = pgEnum('notification_type', [
  'ANNOUNCEMENT',
  'EVENT',
  'DONATION',
  'SYSTEM_ALERT',
  'OTHER',
])

export const notificationStatusEnum = pgEnum('notification_status', [
  'DRAFT',
  'SCHEDULED',
  'PUBLISHED',
  'ARCHIVED',
  'DELETED',
])

export const notificationPriorityEnum = pgEnum('notification_priority', [
  'DEFAULT',
  'IMPORTANT',
  'URGENT',
])

// Main notifications table
export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    title: text('title').notNull(),
    content: text('content').notNull(),
    type: notificationTypeEnum('type').notNull().default('ANNOUNCEMENT'),
    status: notificationStatusEnum('status').notNull().default('DRAFT'),
    priority: notificationPriorityEnum('priority').notNull().default('DEFAULT'),
    senderId: uuid('sender_id').notNull().references(() => user.id),
    churchId: uuid('church_id').notNull().references(() => church.id),
    groupId: uuid('group_id').references(() => groups.id), // null for church-wide
    eventId: uuid('event_id').references(() => events.id), // optional event link
    isChurchWide: boolean('is_church_wide').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
    publishedAt: timestamp('published_at', { withTimezone: true }), // when notification was published
    scheduledFor: timestamp('scheduled_for', { withTimezone: true }), // when to schedule for
  },
  (table) => [
    index('notifications_group_id_status_idx').on(table.groupId, table.status),
    index('notifications_sender_id_created_at_idx').on(table.senderId, table.createdAt),
    index('notifications_church_id_idx').on(table.churchId),
  ]
)

// Notification recipients bridge table - tracks delivery to individual members
export const notificationRecipients = pgTable(
  'notification_recipients',
  {
    id: uuid('id').primaryKey().notNull().defaultRandom(),
    notificationId: uuid('notification_id').notNull().references(() => notifications.id),
    memberId: uuid('member_id').notNull().references(() => members.id),
    readAt: timestamp('read_at', { withTimezone: true }), // null = unread, populated = read
    deletedByMember: boolean('deleted_by_member').notNull().default(false), // soft delete by member
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index('notification_recipients_member_id_read_at_idx').on(table.memberId, table.readAt),
    index('notification_recipients_notification_id_idx').on(table.notificationId),
  ]
)

// Relations
export const notificationsRelations = relations(notifications, ({ one, many }) => ({
  sender: one(user, {
    fields: [notifications.senderId],
    references: [user.id],
  }),
  church: one(church, {
    fields: [notifications.churchId],
    references: [church.id],
  }),
  group: one(groups, {
    fields: [notifications.groupId],
    references: [groups.id],
  }),
  event: one(events, {
    fields: [notifications.eventId],
    references: [events.id],
  }),
  recipients: many(notificationRecipients),
}))

export const notificationRecipientsRelations = relations(
  notificationRecipients,
  ({ one }) => ({
    notification: one(notifications, {
      fields: [notificationRecipients.notificationId],
      references: [notifications.id],
    }),
    member: one(members, {
      fields: [notificationRecipients.memberId],
      references: [members.id],
    }),
  })
)
