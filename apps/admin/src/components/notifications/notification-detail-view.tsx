import { Button } from "@/components/ui/button";
import { AlertCircle, Trash2, Send, Eye, Edit2 } from "lucide-react";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import { toast } from "sonner";

interface NotificationDetailViewProps {
	id: string;
	onEdit: () => void;
	onRefresh: () => void;
}

export function NotificationDetailView({
	id,
	onEdit,
	onRefresh,
}: NotificationDetailViewProps) {
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [showPreview, setShowPreview] = useState(false);

	const notificationQuery = useQuery(
		trpc.admin.notifications.get.queryOptions({ id }),
	);

	const publishMutation = useMutation(trpc.admin.notifications.publish.mutationOptions({
		onSuccess: () => {
			toast.success("Notification published successfully");
			notificationQuery.refetch();
			onRefresh();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to publish notification");
		},
	}));

	const previewMutation = useQuery(
		trpc.admin.notifications.preview.queryOptions({ id }),
	);

	const deleteMutation = useMutation(trpc.admin.notifications.delete.mutationOptions({

		onSuccess: () => {
			toast.success("Notification deleted successfully");
			window.history.back();
		},
		onError: (error) => {
			toast.error(error.message || "Failed to delete notification");
		},
	}));

	if (notificationQuery.isLoading) {
		return <div className="flex items-center justify-center h-full"><p>Loading...</p></div>;
	}

	const notification = notificationQuery.data;

	if (!notification) {
		return (
			<div className="flex items-center justify-center h-full">
				<div className="text-center">
					<AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
					<p className="text-muted-foreground">Notification not found</p>
				</div>
			</div>
		);
	}

	const statusColor =
		{
			DRAFT: "bg-gray-100 text-gray-800",
			SCHEDULED: "bg-blue-100 text-blue-800",
			PUBLISHED: "bg-green-100 text-green-800",
			ARCHIVED: "bg-yellow-100 text-yellow-800",
			DELETED: "bg-red-100 text-red-800",
		}[notification.status] || "bg-gray-100 text-gray-800";

	const canPublish =
		notification.status === "DRAFT" || notification.status === "SCHEDULED";
	const canDelete = notification.status !== "PUBLISHED";

	return (
		<div className="h-full overflow-y-auto">
			<div className="p-6 space-y-6">
				{/* Header */}
				<div className="space-y-4">
					<div className="flex items-start justify-between">
						<div>
							<h1 className="text-3xl font-bold">{notification.title}</h1>
							<div className="flex items-center gap-2 mt-2">
								<span
									className={`text-xs px-3 py-1 rounded font-medium ${statusColor}`}
								>
									{notification.status}
								</span>
								{notification.priority === "URGENT" && (
									<span className="text-xs px-3 py-1 rounded font-medium bg-red-100 text-red-800">
										URGENT
									</span>
								)}
								{notification.priority === "IMPORTANT" && (
									<span className="text-xs px-3 py-1 rounded font-medium bg-orange-100 text-orange-800">
										IMPORTANT
									</span>
								)}
							</div>
						</div>
					</div>

					<div className="text-sm text-muted-foreground space-y-1">
						<p>
							<span className="font-semibold">Type:</span> {notification.type}
						</p>
						<p>
							<span className="font-semibold">Target:</span>{" "}
							{notification.isChurchWide
								? "Church-Wide"
								: `Group: ${notification.group?.name || "Unknown"}`}
						</p>
						<p>
							<span className="font-semibold">Created:</span>{" "}
							{new Date(notification.createdAt).toLocaleString()}
						</p>
						{notification.publishedAt && (
							<p>
								<span className="font-semibold">Published:</span>{" "}
								{new Date(notification.publishedAt).toLocaleString()}
							</p>
						)}
					</div>
				</div>

				{/* Content */}
				<div className="border rounded-lg p-4 bg-card/50">
					<h2 className="font-semibold mb-2">Content</h2>
					<p className="text-sm whitespace-pre-wrap text-muted-foreground">
						{notification.content}
					</p>
				</div>

				{/* Actions */}
				<div className="flex gap-2 flex-wrap">
					{notification.status === "DRAFT" && (
						<Button
							onClick={onEdit}
							variant="outline"
							className="gap-2"
						>
							<Edit2 className="h-4 w-4" />
							Edit
						</Button>
					)}

					{canPublish && (
						<Button
							onClick={() => publishMutation.mutate({ id })}
							disabled={publishMutation.isPending}
							className="gap-2"
						>
							<Send className="h-4 w-4" />
							{publishMutation.isPending ? "Publishing..." : "Publish"}
						</Button>
					)}

					<Button
						variant="outline"
						onClick={() => setShowPreview(!showPreview)}
						className="gap-2"
					>
						<Eye className="h-4 w-4" />
						Preview Recipients
					</Button>

					{canDelete && (
						<Button
							variant="destructive"
							onClick={() => setShowDeleteDialog(true)}
							className="gap-2"
						>
							<Trash2 className="h-4 w-4" />
							Delete
						</Button>
					)}
				</div>

				{/* Preview Recipients */}
				{showPreview && previewMutation.data && (
					<div className="border rounded-lg p-4 bg-card/50">
						<h2 className="font-semibold mb-4">Recipients</h2>
						<div className="space-y-2 text-sm">
							<p>
								<span className="font-semibold">Target:</span>{" "}
								{previewMutation.data.targetGroup}
							</p>
							<p>
								<span className="font-semibold">Total Recipients:</span>{" "}
								{previewMutation.data.recipientCount}
							</p>
						</div>
					</div>
				)}
			</div>

			{/* Delete Dialog */}
			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Notification</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete this notification? This action
							cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<div className="flex gap-2 justify-end">
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => {
								deleteMutation.mutate({ id });
								setShowDeleteDialog(false);
							}}
							disabled={deleteMutation.isPending}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{deleteMutation.isPending ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</div>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
