import {
  pgTable,
  uuid,
  text,
  date,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { user } from "./auth";
import { profiles } from "./profiles";
import { church } from "./churches";

export const members = pgTable("members", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  userId: uuid("user_id").references(() => user.id),
  profileId: uuid("profile_id").references(() => profiles.id),
  churchId: uuid("church_id").references(() => church.id),
  email: text("email"),
});

export const membershipStatus = pgEnum("membership_status", [
  "active",
  "inactive",
  "visitor",
  "transferred",
  "deceased",
]);

export const weddingStatus = pgEnum("wedding_status", [
  "single",
  "married",
  "divorced",
  "widowed",
  "separated",
]);

export const memberData = pgTable("member_data", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  memberId: uuid("member_id")
    .notNull()
    .unique()
    .references(() => members.id, { onDelete: "cascade" }),

  membershipStatus: membershipStatus("membership_status")
    .default("active")
    .notNull(),

  confirmationDate: date("confirmation_date"),
  isCommunicant: boolean("is_communicant").default(false).notNull(),

  baptismDate: date("baptism_date"),
  baptismChurchId: uuid("baptism_church_id").references(() => church.id, {
    onDelete: "set null",
  }),
  baptismChurchName: text("baptism_church_name"),

  district: text("district"),

  previousChurchId: uuid("previous_church_id").references(() => church.id, {
    onDelete: "set null",
  }),
  previousChurchName: text("previous_church_name"),

  weddingStatus: weddingStatus("wedding_status").default("single").notNull(),
  spouseMemberId: uuid("spouse_member_id").references(() => members.id, {
    onDelete: "set null",
  }),
  spouseName: text("spouse_name"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const membersRelations = relations(members, ({ one }) => ({
  user: one(user, { fields: [members.userId], references: [user.id] }),
  profile: one(profiles, {
    fields: [members.profileId],
    references: [profiles.id],
  }),
  church: one(church, { fields: [members.churchId], references: [church.id] }),
  data: one(memberData, {
    fields: [members.id],
    references: [memberData.memberId],
  }),
}));

export const memberDataRelations = relations(memberData, ({ one }) => ({
  member: one(members, {
    fields: [memberData.memberId],
    references: [members.id],
  }),
  baptismChurch: one(church, {
    fields: [memberData.baptismChurchId],
    references: [church.id],
  }),
  previousChurch: one(church, {
    fields: [memberData.previousChurchId],
    references: [church.id],
  }),
  spouseMember: one(members, {
    fields: [memberData.spouseMemberId],
    references: [members.id],
  }),
}));
