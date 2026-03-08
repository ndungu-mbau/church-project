import {
	createFileRoute,
	Link,
	Outlet,
	useLocation,
	useMatch,
} from "@tanstack/react-router";
import { trpc } from "@/utils/trpc";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus, ChevronRight, Bell } from "lucide-react";
import Loader from "@/components/loader";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { NotificationForm } from "@/components/notifications/notification-form";

export const Route = createFileRoute("/_app/notifications")({
	loader: async ({ context }) => {
		await context.queryClient.prefetchQuery(
			context.trpc.admin.notifications.list.queryOptions({}),
		);
	},
	component: NotificationsLayout,
});

function NotificationsLayout() {
	const { pathname } = useLocation();
	const isAddRoute = useMatch({
		from: "/_app/notifications/add",
		shouldThrow: false,
	});
	const notificationsQuery = useQuery(
		trpc.admin.notifications.list.queryOptions({}),
	);
	const [isCreateOpen, setIsCreateOpen] = useState(false);

	if (notificationsQuery.isLoading) {
		return <Loader />;
	}

	const notifications = notificationsQuery.data ?? [];

	const showSidebar = !isAddRoute;

	return (
		<div className="flex h-full overflow-hidden">
			{/* Sidebar / Master List */}
			{showSidebar && (
				<div className="w-80 border-r flex flex-col bg-card/50">
					<div className="p-4 border-b flex items-center justify-between shrink-0">
						<h1 className="text-xl font-bold flex items-center gap-2">
							<Bell className="h-5 w-5 text-primary" />
							Notifications
						</h1>
						<Button
							size="icon"
							variant="outline"
							className="h-8 w-8"
							onClick={() => setIsCreateOpen(true)}
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>

					<div className="flex-1 overflow-y-auto p-2 space-y-1">
						{notifications.map((notification) => {
							const isActive = pathname.includes(
								`/notifications/${notification.id}`,
							);
							const statusColor =
								{
									DRAFT: "bg-gray-100 text-gray-800",
									SCHEDULED: "bg-blue-100 text-blue-800",
									PUBLISHED: "bg-green-100 text-green-800",
									ARCHIVED: "bg-yellow-100 text-yellow-800",
									DELETED: "bg-red-100 text-red-800",
								}[notification.status] || "bg-gray-100 text-gray-800";

							return (
								<Link
									key={notification.id}
									to="/notifications/$id"
									params={{ id: notification.id }}
									className={cn(
										"block p-3 rounded-lg transition-colors group",
										isActive
											? "bg-primary text-primary-foreground"
											: "hover:bg-muted",
									)}
								>
									<div className="flex items-center justify-between">
										<div className="flex-1 min-w-0">
											<p className="font-medium truncate text-sm">
												{notification.title}
											</p>
											<div className="flex items-center gap-2 mt-1">
												<span
													className={cn(
														"text-xs px-2 py-0.5 rounded",
														isActive ? "bg-primary-foreground/20" : statusColor,
													)}
												>
													{notification.status}
												</span>
												{notification.priority === "URGENT" && (
													<span
														className={cn(
															"text-xs px-2 py-0.5 rounded",
															isActive
																? "bg-primary-foreground/20"
																: "bg-red-100 text-red-800",
														)}
													>
														URGENT
													</span>
												)}
											</div>
										</div>
										<ChevronRight
											className={cn(
												"h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5",
												isActive
													? "text-primary-foreground"
													: "text-muted-foreground",
											)}
										/>
									</div>
								</Link>
							);
						})}

						{notifications.length === 0 && (
							<div className="text-center py-10 px-4">
								<p className="text-sm text-muted-foreground">
									No notifications found.
								</p>
								<Button
									variant="link"
									size="sm"
									className="mt-2 text-primary"
									onClick={() => setIsCreateOpen(true)}
								>
									Create your first one
								</Button>
							</div>
						)}
					</div>
				</div>
			)}

			{/* Detail Area / Outlet */}
			<div className="flex-1 overflow-y-auto relative bg-background">
				<Outlet />
			</div>

			<Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
				<SheetContent className="sm:max-w-xl w-full overflow-y-auto px-4">
					<SheetHeader>
						<SheetTitle>Create Notification</SheetTitle>
					</SheetHeader>
					<div className="mt-4 h-full pb-8">
						<NotificationForm
							onSuccess={() => setIsCreateOpen(false)}
							onCancel={() => setIsCreateOpen(false)}
						/>
					</div>
				</SheetContent>
			</Sheet>
		</div>
	);
}
