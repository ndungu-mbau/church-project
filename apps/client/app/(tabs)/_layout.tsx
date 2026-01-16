import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/use-theme-color";

import { Link } from "expo-router";
import { Pressable } from "react-native";

export default function TabLayout() {
	const themeColorForeground = useThemeColor("foreground");
	const themeColorBackground = useThemeColor("background");

	return (
		<Tabs
			screenOptions={{
				headerShown: true,
				headerStyle: {
					backgroundColor: themeColorBackground,
				},
				headerTintColor: themeColorForeground,
				headerTitleStyle: {
					color: themeColorForeground,
					fontWeight: "600",
				},
				tabBarStyle: {
					backgroundColor: themeColorBackground,
				},
				headerRight: () => (
					<Link href="/profile" asChild>
						<Pressable className="mr-4">
							<Ionicons
								name="person-circle-outline"
								size={28}
								color={themeColorForeground}
							/>
						</Pressable>
					</Link>
				),
			}}
		>
			<Tabs.Screen
				name="index"
				options={{
					title: "Home",
					tabBarIcon: ({ color, size }: { color: string; size: number }) => (
						<Ionicons name="home" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="events"
				options={{
					title: "Events",
					tabBarIcon: ({ color, size }: { color: string; size: number }) => (
						<Ionicons name="calendar" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="groups"
				options={{
					title: "Groups",
					tabBarIcon: ({ color, size }: { color: string; size: number }) => (
						<Ionicons name="people" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="prayer"
				options={{
					title: "Prayer",
					tabBarIcon: ({ color, size }: { color: string; size: number }) => (
						<Ionicons name="chatbubbles" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="components"
				options={{
					headerShown: false,
					title: "Components",
					tabBarIcon: ({ color, size }: { color: string; size: number }) => (
						<Ionicons name="compass" size={size} color={color} />
					),
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					href: null, // Hide from tab bar
				}}
			/>
		</Tabs>
	);
}



