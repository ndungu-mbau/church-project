import type { auth } from "@church-project/auth";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

import { profileLinkerClient } from "@church-project/auth/plugins/profile-linker/client";

export const authClient = createAuthClient({
	baseURL: import.meta.env.VITE_SERVER_URL,
	plugins: [inferAdditionalFields<typeof auth>(), profileLinkerClient()],
});
