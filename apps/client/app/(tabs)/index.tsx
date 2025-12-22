import { useState } from 'react'
import { Text, View } from "react-native";
import { Container } from "@/components/container";
import { authClient } from "@/lib/auth-client";
import { Ionicons } from "@expo/vector-icons";
import { Chip } from "@/components/ui/chip";

import { useThemeColor } from "@/hooks/use-theme-color";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { SignIn } from "@/components/sign-in";
import { SignUp } from "@/components/sign-up";
import { useQuery } from "@tanstack/react-query";
import { queryClient, trpc } from "@/utils/trpc";
import { AlertCircle, CheckCircle2 } from "lucide-react-native";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import React from "react";

export default function Home() {
	const healthCheck = useQuery(trpc.healthCheck.queryOptions());
	const isConnected = healthCheck?.data === "OK";
	const isLoading = healthCheck?.isLoading;
	const { data: session } = authClient.useSession();

	const mutedColor = useThemeColor("muted");
	const successColor = useThemeColor("success");
	const dangerColor = useThemeColor("danger");
	const foregroundColor = useThemeColor("foreground");

	const [value, setValue] = useState("signin");

	return (
		<Container className="p-6">
			<View className="py-4 mb-6">
				<Text className="text-4xl font-bold text-foreground mb-2">
					IMANI MANAGER
				</Text>
			</View>

			{session?.user ? (
				<Card variant="surface-1" className="mb-6 p-4">
					<Text className="text-foreground text-base mb-2">
						Welcome, <Text className="font-medium">{session.user.name}</Text>
					</Text>
					<Text className="text-muted text-sm mb-4">{session.user.email}</Text>
					<Button
						variant="destructive"
						onPress={() => {
							authClient.signOut();
							queryClient.invalidateQueries();
						}}
					>
						<Text className="text-primary-foreground font-medium">Sign Out</Text>
					</Button>
				</Card>
			) : null}

			<Card className="p-6">
				<View className="flex-row items-center justify-between mb-4">
					<CardTitle>System Status</CardTitle>
					<Chip
						variant="flat"
						color={isConnected ? "success" : "danger"}
						size="sm"
						label={isConnected ? "LIVE" : "OFFLINE"}
						startContent={isConnected ? <CheckCircle2 size={14} color="#22c55e" /> : <AlertCircle size={14} color="#ef4444" />}
					/>
				</View>

				<Card variant="surface-2" className="p-4">
					<View className="flex-row items-center">
						<View
							className={`w-3 h-3 rounded-full mr-3 ${isConnected ? "bg-success" : "bg-muted"}`}
						/>
						<View className="flex-1">
							<Text className="text-foreground font-medium mb-1">
								TRPC Backend
							</Text>
							<CardDescription>
								{isLoading
									? "Checking connection..."
									: isConnected
										? "Connected to API"
										: "API Disconnected"}
							</CardDescription>
						</View>
						{isLoading && (
							<Ionicons name="hourglass-outline" size={20} color={mutedColor} />
						)}
						{!isLoading && isConnected && (
							<Ionicons
								name="checkmark-circle"
								size={20}
								color={successColor}
							/>
						)}
						{!isLoading && !isConnected && (
							<Ionicons name="close-circle" size={20} color={dangerColor} />
						)}
					</View>
				</Card>
			</Card>

			{!session?.user && (
				<Tabs value={value} className="mt-8" onValueChange={(value) => setValue(value)}>
					<TabsList className="w-full">
						<TabsTrigger value="signin">Sign In</TabsTrigger>
						<TabsTrigger value="signup">Sign Up</TabsTrigger>
					</TabsList>
					<TabsContent value="signin">
						<SignIn />
					</TabsContent>
					<TabsContent value="signup">
						<SignUp />
					</TabsContent>
				</Tabs>
			)}
		</Container>
	);
}
