import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/utils/trpc";
import { useState } from "react";
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
	const [error, setError] = useState<string | null>(null);

	const mutedColor = useThemeColor("muted");
	const accentColor = useThemeColor("accent");
	const foregroundColor = useThemeColor("foreground");
	const dangerColor = useThemeColor("danger");

	const session = authClient.useSession()

	const router = useRouter()

	async function handleLogin() {
		setIsLoading(true);
		setError(null);

		await authClient.signIn.email(
			{
				email,
				password,
			},
			{
				onError(error) {
					setError(error.error?.message || "Failed to sign in");
					setIsLoading(false);
				},
				async onSuccess() {
					setEmail("");
					setPassword("");
					queryClient.refetchQueries();
					router.replace('/(tabs)')
				},
				onFinished() {
					setIsLoading(false);
				},
			},
		);
	}

	return (
		<Card variant="secondary" className="mt-6 p-4">
			<Card.Title className="mb-4">Sign In</Card.Title>

			{error ? (
				<View className="mb-4 p-3 bg-danger/10 rounded-lg">
					<Text className="text-danger text-sm">{error}</Text>
				</View>
			) : null}

			<TextInput
				className="mb-3 py-3 px-4 rounded-lg bg-surface text-foreground border border-divider"
				placeholder="Email"
				value={email}
				onChangeText={setEmail}
				placeholderTextColor={mutedColor}
				keyboardType="email-address"
				autoCapitalize="none"
			/>

			<TextInput
				className="mb-4 py-3 px-4 rounded-lg bg-surface text-foreground border border-divider"
				placeholder="Password"
				value={password}
				onChangeText={setPassword}
				placeholderTextColor={mutedColor}
				secureTextEntry
			/>

			<Pressable
				onPress={handleLogin}
				disabled={isLoading}
				className="bg-accent p-4 rounded-lg flex-row justify-center items-center active:opacity-70"
			>
				{isLoading ? (
					<ActivityIndicator size="small" color={foregroundColor} />
				) : (
					<Text className="text-foreground font-medium">Sign In</Text>
				)}
			</Pressable>
		</Card>
	);
}

export { SignIn };
