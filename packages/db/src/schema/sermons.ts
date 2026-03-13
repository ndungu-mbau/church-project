import { pgTable, uuid, text, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm/relations";
import { church } from "./churches";
import { user } from "./auth";

export const sermons = pgTable("sermons", {
  id: uuid("id").primaryKey().notNull().defaultRandom(),
  title: text("title"),
  content: text("content"),
  verses: text("verses").array(),
  category: text("category"),
  link: text("link"),
  date: timestamp("date", { withTimezone: true }),
  churchId: uuid("church_id").references(() => church.id),
  createdBy: uuid("created_by").references(() => user.id),
});

export const sermonsRelations = relations(sermons, ({ one }) => ({
  church: one(church, {
    fields: [sermons.churchId],
    references: [church.id],
  }),
  createdBy: one(user, {
    fields: [sermons.createdBy],
    references: [user.id],
  }),
}));
