import { Container } from "@/components/container";
import { Link, Stack } from "expo-router";
import { Text, View, Pressable } from "react-native";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";

export default function NotFoundScreen() {
	return (
		<>
			<Stack.Screen options={{ title: "Oops!" }} />
			<Container>
				<View className="flex-1 justify-center items-center p-6">
					<Card variant="surface-1" className="items-center p-8 max-w-md">
						<Text className="text-6xl mb-4">🤔</Text>
						<CardTitle className="text-2xl text-center mb-2">
							Page Not Found
						</CardTitle>
						<CardDescription className="text-center mb-6">
							Sorry, the page you're looking for doesn't exist.
						</CardDescription>
						<Link href="/" asChild>
							<Pressable className="bg-accent px-6 py-3 rounded-lg active:opacity-70">
								<Text className="text-accent-foreground font-medium text-base">
									Go to Home
								</Text>
							</Pressable>
						</Link>
					</Card>
				</View>
			</Container>
		</>
	);
}
