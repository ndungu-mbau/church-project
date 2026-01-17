import "@/global.css";

import { QueryClientProvider } from "@tanstack/react-query";

import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { AppThemeProvider } from "@/contexts/app-theme-context";
import { PortalHost } from "@rn-primitives/portal";

import { queryClient } from "@/utils/trpc";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "@/contexts/auth-context";

function StackLayout() {
	return (
		<Stack screenOptions={{
		}}>
			<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
			<Stack.Screen name="(auth)" options={{ headerShown: false }} />
			<Stack.Screen
				name="modal"
				options={{ title: "Modal", presentation: "modal" }}
			/>
		</Stack>
	);
}


export default function Layout() {
	return (
		<QueryClientProvider client={queryClient}>
			<SessionProvider>
				<GestureHandlerRootView style={{ flex: 1 }}>
					<KeyboardProvider>
						<AppThemeProvider>
							<StackLayout />
							<Toaster />
							<PortalHost />
						</AppThemeProvider>
					</KeyboardProvider>
				</GestureHandlerRootView>
			</SessionProvider>
		</QueryClientProvider>
	);
}
