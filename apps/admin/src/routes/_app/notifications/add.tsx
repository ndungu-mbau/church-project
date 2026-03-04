import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { NotificationForm } from '@/components/notifications/notification-form'

export const Route = createFileRoute('/_app/notifications/add')({
  component: AddNotification,
})

function AddNotification() {
  const navigate = useNavigate()

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create Notification</h1>
          <p className="text-muted-foreground mt-2">
            Create a new notification to send to members
          </p>
        </div>

        <NotificationForm
          onSuccess={() => navigate({ to: '/notifications' })}
          onCancel={() => navigate({ to: '/notifications' })}
        />
      </div>
    </div>
  )
}
