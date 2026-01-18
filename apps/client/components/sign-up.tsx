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

function SignUp() {
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();

	const router = useRouter()

	async function handleSignUp() {
		setIsLoading(true);

		await authClient.signUp.email(
			{
				name,
				email,
				password,
			},
			{
				onError(error) {
					toast({
						title: "Sign up failed",
						description: error.error?.message || "Please check your details.",
						variant: "destructive",
					});
					setIsLoading(false);
				},
				onSuccess() {
					setName("");
					setEmail("");
					setPassword("");
					toast({
						title: "Account created!",
						description: "You have successfully signed up.",
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
				<CardTitle className="text-2xl">Create Account</CardTitle>
				<CardDescription>
					Join us today to manage your church activities effortlessly.
				</CardDescription>
			</CardHeader>
			<CardContent className="px-0 gap-4">
				<View className="gap-1.5">
					<Label nativeID="name-label">Full Name</Label>
					<Input
						aria-labelledby="name-label"
						placeholder="John Doe"
						value={name}
						onChangeText={setName}
					/>
				</View>
				<View className="gap-1.5">
					<Label nativeID="email-signup-label">Email</Label>
					<Input
						aria-labelledby="email-signup-label"
						placeholder="name@example.com"
						value={email}
						onChangeText={setEmail}
						keyboardType="email-address"
						autoCapitalize="none"
					/>
				</View>
				<View className="gap-1.5">
					<Label nativeID="password-signup-label">Password</Label>
					<Input
						aria-labelledby="password-signup-label"
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
					onPress={handleSignUp}
					disabled={isLoading}
				>
					{isLoading ? (
						<ActivityIndicator size="small" color="white" />
					) : (
						<Text className="text-primary-foreground font-medium">Sign Up</Text>
					)}
				</Button>
			</CardFooter>
		</Card>
	);
}

export { SignUp };
