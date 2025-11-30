import { expo } from '@better-auth/expo';
import { betterAuth, type BetterAuthOptions } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@church-project/db";
import * as schema from "@church-project/db/schema/auth";
import { sessionStorage } from "@church-project/utils";
import { otpPluginServer } from "./plugins/otp-plugin";
import crypto from "node:crypto"

export * from "./plugins/otp-plugin";


export const auth = betterAuth<BetterAuthOptions>({
	database: drizzleAdapter(db, {
		provider: "pg",

		schema: schema,
	}),
	trustedOrigins: ["*"],
	emailAndPassword: {
		enabled: true,
	},
	user: {
		additionalFields: {
			role: {
				type: "string",
				required: true,
				defaultValue: "guest",
				input: false, // Don't allow setting this during signup
			},
			phone: {
				type: "string",
				required: false,
				unique: true,
				input: true,
			},
			phoneVerified: {
				type: "boolean",
				required: true,
				defaultValue: false,
				input: false,
			},
		},
	},
	// Secondary storage for sessions, OTPs, and temporary data
	secondaryStorage: {
		get: async (key: string) => {
			const value = await sessionStorage.get(key)
			return value ? JSON.parse(value) : null
		},
		set: async (key: string, value: unknown, ttl?: number) => {
			await sessionStorage.set(key, JSON.stringify(value), ttl)
		},
		delete: async (key: string) => {
			await sessionStorage.delete(key)
		},
	},
	advanced: {
		defaultCookieAttributes: {
			sameSite: "none",
			secure: true,
			httpOnly: true,
		},
		database: {
			generateId: () => crypto.randomUUID(),
		}
	},
  plugins: [expo(), otpPluginServer()]
});

