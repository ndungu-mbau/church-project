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
import { Field, FieldContent, FieldError, FieldLabel } from "@/components/ui/field";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

interface NotificationEditFormProps {
  id: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NotificationEditForm({
  id,
  onSuccess,
  onCancel,
}: NotificationEditFormProps) {
  const queryClient = useQueryClient();
  const [isChurchWide, setIsChurchWide] = useState(false);

  // Fetch notification data for prefilling
  const notificationQuery = useQuery(
    trpc.admin.notifications.get.queryOptions({ id })
  );

  // Fetch groups for dropdown
  const groupsQuery = useQuery(trpc.admin.groups.list.queryOptions());

  const updateNotification = useMutation(
    trpc.admin.notifications.update.mutationOptions({
      onSuccess: () => {
        toast.success("Notification updated successfully");
        queryClient.invalidateQueries({ queryKey: trpc.admin.notifications.list.queryKey() });
        queryClient.invalidateQueries({
          queryKey: trpc.admin.notifications.get.queryKey({ id }),
        });
        onSuccess?.();
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to update notification");
      },
    })
  );

  const notification = notificationQuery.data;

  const form = useForm({
    defaultValues: {
      title: notification?.title || "",
      content: notification?.content || "",
      type: notification?.type || "ANNOUNCEMENT",
      priority: notification?.priority || "DEFAULT",
      isChurchWide: notification?.isChurchWide || true,
      groupId: notification?.groupId || undefined,
    },
    onSubmit: async ({ value }) => {
      const submitData = {
        id,
        title: value.title,
        content: value.content,
        type: value.type,
        priority: value.priority,
        groupId: isChurchWide ? undefined : value.groupId,
      };
      await updateNotification.mutateAsync(submitData);
    },
  });

  // Set initial isChurchWide state when notification data loads
  if (notification && !notificationQuery.isLoading && !form.state.isDirty && isChurchWide === false && notification.isChurchWide) {
    setIsChurchWide(true);
  }

  if (notificationQuery.isLoading) {
    return <div className="p-6"><p>Loading...</p></div>;
  }

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center gap-2 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold">Edit Notification</h1>
          </div>

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
              <Button
                type="submit"
                disabled={updateNotification.isPending}
              >
                {updateNotification.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
