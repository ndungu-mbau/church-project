import { relations } from "drizzle-orm";
import {
  boolean,
  decimal,
  index,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { church } from "./churches";

export const subscriptionInterval = pgEnum("subscription_interval", [
  "monthly",
  "yearly",
]);

export const subscriptionStatus = pgEnum("subscription_status", [
  "active",
  "canceled",
  "past_due",
  "incomplete",
  "incomplete_expired",
  "trialing",
  "unpaid",
  "paused",
]);

export const paymentStatus = pgEnum("payment_status", [
  "succeeded",
  "pending",
  "failed",
  "refunded",
]);

export const invoiceStatus = pgEnum("invoice_status", [
  "paid",
  "open",
  "void",
  "uncollectible",
  "draft",
]);

export const subscriptionPlan = pgTable("subscription_plan", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").default("KES").notNull(),
  interval: subscriptionInterval("interval").notNull(),
  features: jsonb("features").$type<string[]>(), // List of features included
  isActive: boolean("is_active").default(true).notNull(),
  stripePriceId: text("stripe_price_id"), // For Stripe integration
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
});

export const churchSubscription = pgTable(
  "church_subscription",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    churchId: uuid("church_id")
      .notNull()
      .references(() => church.id, { onDelete: "cascade" }),
    planId: uuid("plan_id")
      .notNull()
      .references(() => subscriptionPlan.id),
    status: subscriptionStatus("status").default("active").notNull(),
    currentPeriodStart: timestamp("current_period_start", {
      withTimezone: true,
    }).notNull(),
    currentPeriodEnd: timestamp("current_period_end", {
      withTimezone: true,
    }).notNull(),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
    stripeSubscriptionId: text("stripe_subscription_id"), // For Stripe integration
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [
    index("church_subscription_church_id_idx").on(table.churchId),
    index("church_subscription_status_idx").on(table.status),
  ],
);

export const payment = pgTable(
  "payment",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    subscriptionId: uuid("subscription_id")
      .notNull()
      .references(() => churchSubscription.id, { onDelete: "cascade" }),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: text("currency").default("KES").notNull(),
    status: paymentStatus("status").notNull(),
    provider: text("provider").notNull(), // e.g., 'stripe', 'mpesa'
    providerTransactionId: text("provider_transaction_id"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("payment_subscription_id_idx").on(table.subscriptionId),
    index("payment_provider_transaction_id_idx").on(
      table.providerTransactionId,
    ),
  ],
);

export const invoice = pgTable(
  "invoice",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    subscriptionId: uuid("subscription_id")
      .notNull()
      .references(() => churchSubscription.id, { onDelete: "cascade" }),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: text("currency").default("KES").notNull(),
    status: invoiceStatus("status").notNull(),
    pdfUrl: text("pdf_url"),
    stripeInvoiceId: text("stripe_invoice_id"),
    paidAt: timestamp("paid_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("invoice_subscription_id_idx").on(table.subscriptionId)],
);

// Relations
export const subscriptionPlanRelations = relations(
  subscriptionPlan,
  ({ many }) => ({
    subscriptions: many(churchSubscription),
  }),
);

export const churchSubscriptionRelations = relations(
  churchSubscription,
  ({ one, many }) => ({
    church: one(church, {
      fields: [churchSubscription.churchId],
      references: [church.id],
    }),
    plan: one(subscriptionPlan, {
      fields: [churchSubscription.planId],
      references: [subscriptionPlan.id],
    }),
    payments: many(payment),
    invoices: many(invoice),
  }),
);

export const paymentRelations = relations(payment, ({ one }) => ({
  subscription: one(churchSubscription, {
    fields: [payment.subscriptionId],
    references: [churchSubscription.id],
  }),
}));

export const invoiceRelations = relations(invoice, ({ one }) => ({
  subscription: one(churchSubscription, {
    fields: [invoice.subscriptionId],
    references: [churchSubscription.id],
  }),
}));
