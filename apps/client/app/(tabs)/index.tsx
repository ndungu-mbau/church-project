import { authClient } from "@/lib/auth-client";
import { DashboardScreen } from "@/screens/authenticated/member/dashboard-screen";
import { LandingScreen } from "@/screens/auth/landing-screen";
import React from "react";

export default function Home() {
	const { data: session } = authClient.useSession();

	if (session?.user) {
		return <DashboardScreen />;
	}

	return <LandingScreen />;
}

