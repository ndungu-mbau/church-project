import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { NotificationDetailView } from "@/components/notifications/notification-detail-view";
import { NotificationEditForm } from "@/components/notifications/notification-edit-form";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "@/utils/trpc";
import Loader from "@/components/loader";

export const Route = createFileRoute("/_app/notifications/$id")({
  component: NotificationDetail,
  validateSearch: (search: any) => ({
    edit: search?.edit === "true" || search?.edit === true,
  }),
});

function NotificationDetail() {
  const { id } = Route.useParams();
  const { edit } = useSearch({ from: "/_app/notifications/$id" });
  const navigate = useNavigate({ from: "/notifications/$id" });

  const notificationQuery = useQuery(
    trpc.admin.notifications.get.queryOptions({ id }),
  );

  const handleEdit = () => {
    navigate({
      search: (prev) => ({ ...prev, edit: true }),
    });
  };

  const handleCancelEdit = () => {
    navigate({
      search: (prev) => {
        const { edit, ...rest } = prev;
        return rest;
      },
    });
  };

  const handleEditSuccess = () => {
    navigate({
      search: (prev) => {
        const { edit, ...rest } = prev;
        return rest;
      },
    });
  };

  const handleRefresh = () => {
    notificationQuery.refetch();
  };

  if (notificationQuery.isLoading) {
    return <Loader />;
  }

  return edit ? (
    <NotificationEditForm
      id={id}
      onSuccess={handleEditSuccess}
      onCancel={handleCancelEdit}
    />
  ) : (
    <NotificationDetailView
      id={id}
      onEdit={handleEdit}
      onRefresh={handleRefresh}
    />
  );
}
