import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/utils/trpc";
import { useState } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
	CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Redirect, useRouter } from "expo-router";

function SignIn() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const session = authClient.useSession()

	const router = useRouter()

	async function handleLogin() {
		setIsLoading(true);

		await authClient.signIn.email(
			{
				email,
				password,
			},
			{
				onError(error) {
					toast({
						title: "Sign in failed",
						description: error.error?.message || "Please check your credentials.",
						variant: "destructive",
					});
					setIsLoading(false);
				},
				async onSuccess() {
					setEmail("");
					setPassword("");
					toast({
						title: "Welcome back!",
						description: "You have successfully signed in.",
						variant: "success",
					});
					queryClient.refetchQueries();
					router.replace('/(tabs)')
				},
				onFinished() {
					setIsLoading(false);
				},
			}
		);
	}

	return (
		<Card className="mt-6 border-none shadow-none bg-transparent">
			<CardHeader className="px-0">
				<CardTitle className="text-2xl">Sign In</CardTitle>
				<CardDescription>
					Enter your email and password to access your account.
				</CardDescription>
			</CardHeader>
			<CardContent className="px-0 gap-4">
				<View className="gap-1.5">
					<Label nativeID="email-label">Email</Label>
					<Input
						aria-labelledby="email-label"
						placeholder="name@example.com"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
						autoCapitalize="none"
					/>
				</View>
				<View className="gap-1.5">
					<Label nativeID="password-label">Password</Label>
					<Input
						aria-labelledby="password-label"
						placeholder="••••••••"
						value={password}
						onChangeText={setPassword}
						secureTextEntry
					/>
				</View>
			</CardContent>
			<CardFooter className="px-0 pt-2">
				<Button
					className="w-full"
					onPress={handleLogin}
					disabled={isLoading}
				>
					{isLoading ? (
						<ActivityIndicator size="small" color="white" />
					) : (
						<Text className="text-primary-foreground font-medium">Sign In</Text>
					)}
				</Button>
			</CardFooter>
		</Card>
	);
}

export { SignIn };
