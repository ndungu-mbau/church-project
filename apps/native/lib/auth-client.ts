import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@church-project/auth";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { getBaseUrl } from "@/utils/base-url";

export const authClient = createAuthClient({
	baseURL: getBaseUrl(),
	plugins: [
		inferAdditionalFields<typeof auth>(),
		expoClient({
			scheme: Constants.expoConfig?.scheme as string,
			storagePrefix: Constants.expoConfig?.scheme as string,
			storage: SecureStore,
		}),
	],
});
