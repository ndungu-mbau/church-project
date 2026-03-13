import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { trpc } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";

interface NotificationFormProps {
	onSuccess?: () => void;
	onCancel?: () => void;
}

export function NotificationForm({
	onSuccess,
	onCancel,
}: NotificationFormProps) {
	const queryClient = useQueryClient();
	const [isChurchWide, setIsChurchWide] = useState(true);

	// Fetch groups for dropdown
	const groupsQuery = useQuery(trpc.admin.groups.list.queryOptions());

	const createNotification = useMutation(
		trpc.admin.notifications.create.mutationOptions({
			onSuccess: () => {
				toast.success("Notification created successfully");
				queryClient.invalidateQueries({
					queryKey: trpc.admin.notifications.list.queryKey(),
				});
				onSuccess?.();
			},
			onError: (error: any) => {
				toast.error(error.message || "Failed to create notification");
			},
		}),
	);

	const form = useForm({
		defaultValues: {
			title: "",
			content: "",
			type: "ANNOUNCEMENT" as const,
			priority: "DEFAULT" as const,
			isChurchWide: true,
			groupId: undefined as string | undefined,
			status: "DRAFT" as const,
		},
		onSubmit: async ({ value }) => {
			// Clear groupId if church-wide
			const submitData = {
				...value,
				groupId: isChurchWide ? undefined : value.groupId,
			};
			await createNotification.mutateAsync(submitData);
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				e.stopPropagation();
				form.handleSubmit();
			}}
			className="space-y-6"
		>
			{/* Title Field */}
			<form.Field name="title">
				{(field) => (
					<Field>
						<FieldLabel htmlFor={field.name}>Title</FieldLabel>
						<FieldContent>
							<Input
								id={field.name}
								placeholder="Notification title"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								required
							/>
						</FieldContent>
						<FieldError errors={field.state.meta.errors} />
					</Field>
				)}
			</form.Field>

			{/* Content Field */}
			<form.Field name="content">
				{(field) => (
					<Field>
						<FieldLabel htmlFor={field.name}>Content</FieldLabel>
						<FieldContent>
							<Textarea
								id={field.name}
								placeholder="Notification content"
								className="min-h-32"
								value={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
								required
							/>
						</FieldContent>
						<FieldError errors={field.state.meta.errors} />
					</Field>
				)}
			</form.Field>

			{/* Type Field */}
			<form.Field name="type">
				{(field) => (
					<Field>
						<FieldLabel htmlFor={field.name}>Type</FieldLabel>
						<FieldContent>
							<Select
								value={field.state.value}
								onValueChange={(value) => field.handleChange(value as any)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
									<SelectItem value="EVENT">Event</SelectItem>
									<SelectItem value="DONATION">Donation</SelectItem>
									<SelectItem value="SYSTEM_ALERT">System Alert</SelectItem>
									<SelectItem value="OTHER">Other</SelectItem>
								</SelectContent>
							</Select>
						</FieldContent>
						<FieldError errors={field.state.meta.errors} />
					</Field>
				)}
			</form.Field>

			{/* Priority Field */}
			<form.Field name="priority">
				{(field) => (
					<Field>
						<FieldLabel htmlFor={field.name}>Priority</FieldLabel>
						<FieldContent>
							<Select
								value={field.state.value}
								onValueChange={(value) => field.handleChange(value as any)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="DEFAULT">Default</SelectItem>
									<SelectItem value="IMPORTANT">Important</SelectItem>
									<SelectItem value="URGENT">Urgent</SelectItem>
								</SelectContent>
							</Select>
						</FieldContent>
						<FieldError errors={field.state.meta.errors} />
					</Field>
				)}
			</form.Field>

			{/* Target Selection */}
			<div className="space-y-4">
				<label className="text-sm font-medium">Target</label>
				<div className="flex gap-4">
					<label className="flex items-center gap-2 cursor-pointer">
						<input
							type="radio"
							checked={isChurchWide}
							onChange={() => {
								setIsChurchWide(true);
								form.setFieldValue("isChurchWide", true);
							}}
							className="rounded"
						/>
						<span className="text-sm">Church-Wide</span>
					</label>
					<label className="flex items-center gap-2 cursor-pointer">
						<input
							type="radio"
							checked={!isChurchWide}
							onChange={() => {
								setIsChurchWide(false);
								form.setFieldValue("isChurchWide", false);
							}}
							className="rounded"
						/>
						<span className="text-sm">Group</span>
					</label>
				</div>
			</div>

			{/* Group Selection (if not church-wide) */}
			{!isChurchWide && (
				<form.Field name="groupId">
					{(field) => (
						<Field>
							<FieldLabel htmlFor={field.name}>Select Group</FieldLabel>
							<FieldContent>
								<Select
									value={field.state.value || ""}
									onValueChange={(value) =>
										field.handleChange(value || undefined)
									}
								>
									<SelectTrigger>
										<SelectValue placeholder="Choose a group..." />
									</SelectTrigger>
									<SelectContent>
										{groupsQuery.data?.map((group) => (
											<SelectItem key={group.id} value={group.id}>
												{group.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FieldContent>
							<FieldError errors={field.state.meta.errors} />
						</Field>
					)}
				</form.Field>
			)}

			{/* Form Actions */}
			<div className="flex gap-2 pt-4">
				<Button type="submit" disabled={createNotification.isPending}>
					{createNotification.isPending ? "Creating..." : "Create Notification"}
				</Button>
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancel
				</Button>
			</div>
		</form>
	);
}
