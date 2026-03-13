import { createFileRoute } from "@tanstack/react-router";
import { authClient } from "@/lib/auth-client"

export const Route = createFileRoute("/_app/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const { data } = authClient.useSession();

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Welcome {data?.user.name}</p>
		</div>
	)
}
