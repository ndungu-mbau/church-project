import { authClient } from "@/lib/auth-client";
import { DashboardScreen } from "@/screens/authenticated/member/dashboard-screen";
import { Redirect } from "expo-router";
import React from "react";

export default function Home() {
	const { data: session, isPending, refetch } = authClient.useSession();

	if (isPending) return null;

	if (!session?.user) {
		return <Redirect href="/login" />;
	}

	return <DashboardScreen />;
}


