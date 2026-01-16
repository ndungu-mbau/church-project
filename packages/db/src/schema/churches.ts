import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { user } from "./auth";
import { churchSubscription } from "./subscriptions";
import { profiles } from "./profiles";
import { members } from "./members";
import { staff } from "./staff";

// Core church model - required fields for initial registration
export const church = pgTable("church", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  churchId: text("church_id").notNull().unique(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  country: text("country").notNull(),
  postalCode: text("postal_code"),
  pastorId: uuid("pastor_id").references(() => user.id),
  adminId: uuid("admin_id").references(() => user.id),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

// Extended church information - optional fields that can be filled later
export const churchInfo = pgTable("church_info", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  churchId: uuid("church_id")
    .notNull()
    .references(() => church.id, { onDelete: "cascade" })
    .unique(),
  logo: text("logo"), // URL to church logo
  website: text("website"),
  denomination: text("denomination"),
  foundedYear: integer("founded_year"),
  capacity: integer("capacity"),
  description: text("description"),
  timezone: text("timezone"), // e.g., "Africa/Nairobi"

  // Social media links
  facebookUrl: text("facebook_url"),
  twitterUrl: text("twitter_url"),
  instagramUrl: text("instagram_url"),
  youtubeUrl: text("youtube_url"),

  // Service times
  serviceTimes:
    jsonb("service_times").$type<
      Array<{ serviceName: string; serviceTime: string }>
    >(), // Array of service times

  // Additional contact
  alternativePhone: text("alternative_phone"),
  alternativeEmail: text("alternative_email"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const churchRelations = relations(church, ({ one, many }) => ({
  pastor: one(user, {
    fields: [church.pastorId],
    references: [user.id],
  }),
  info: one(churchInfo, {
    fields: [church.id],
    references: [churchInfo.churchId],
  }),
  subscription: one(churchSubscription, {
    fields: [church.id],
    references: [churchSubscription.churchId],
  }),
  profiles: many(profiles),
  members: many(members),
  staff: many(staff),
}));

export const churchInfoRelations = relations(churchInfo, ({ one }) => ({
  church: one(church, {
    fields: [churchInfo.churchId],
    references: [church.id],
  }),
}));
