import { createFileRoute } from '@tanstack/react-router'
import { trpc } from '@/utils/trpc'
import { useQuery, useMutation } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import Loader from '@/components/loader'
import { useToast } from '@/components/ui/use-toast'
import { AlertCircle, Trash2, Send, Eye } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useState } from 'react'

export const Route = createFileRoute('/_app/notifications/$id')({
  component: NotificationDetail,
})

function NotificationDetail() {
  const { id } = Route.useParams()
  const { toast } = useToast()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const notificationQuery = useQuery(
    trpc.admin.notifications.get.queryOptions({ id })
  )

  const publishMutation = useMutation({
    mutationFn: () => trpc.admin.notifications.publish.mutate({ id }),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Notification published successfully',
      })
      notificationQuery.refetch()
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to publish notification',
        variant: 'destructive',
      })
    },
  })

  const previewMutation = useQuery(
    trpc.admin.notifications.preview.queryOptions({ id })
  )

  const deleteMutation = useMutation({
    mutationFn: () => trpc.admin.notifications.delete.mutate({ id }),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Notification deleted successfully',
      })
      window.history.back()
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete notification',
        variant: 'destructive',
      })
    },
  })

  if (notificationQuery.isLoading) {
    return <Loader />
  }

  const notification = notificationQuery.data

  if (!notification) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Notification not found</p>
        </div>
      </div>
    )
  }

  const statusColor = {
    DRAFT: 'bg-gray-100 text-gray-800',
    SCHEDULED: 'bg-blue-100 text-blue-800',
    PUBLISHED: 'bg-green-100 text-green-800',
    ARCHIVED: 'bg-yellow-100 text-yellow-800',
    DELETED: 'bg-red-100 text-red-800',
  }[notification.status] || 'bg-gray-100 text-gray-800'

  const canPublish = notification.status === 'DRAFT' || notification.status === 'SCHEDULED'
  const canDelete = notification.status !== 'PUBLISHED'

  return (
    <div className="h-full overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold">{notification.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className={`text-xs px-3 py-1 rounded font-medium ${statusColor}`}>
                  {notification.status}
                </span>
                {notification.priority === 'URGENT' && (
                  <span className="text-xs px-3 py-1 rounded font-medium bg-red-100 text-red-800">
                    URGENT
                  </span>
                )}
                {notification.priority === 'IMPORTANT' && (
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
              <span className="font-semibold">Target:</span>{' '}
              {notification.isChurchWide
                ? 'Church-Wide'
                : `Group: ${notification.group?.name || 'Unknown'}`}
            </p>
            <p>
              <span className="font-semibold">Created:</span>{' '}
              {new Date(notification.createdAt).toLocaleString()}
            </p>
            {notification.publishedAt && (
              <p>
                <span className="font-semibold">Published:</span>{' '}
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
        <div className="flex gap-2">
          {canPublish && (
            <Button
              onClick={() => publishMutation.mutate()}
              disabled={publishMutation.isPending}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {publishMutation.isPending ? 'Publishing...' : 'Publish'}
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
                <span className="font-semibold">Target:</span>{' '}
                {previewMutation.data.targetGroup}
              </p>
              <p>
                <span className="font-semibold">Total Recipients:</span>{' '}
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
              Are you sure you want to delete this notification? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                deleteMutation.mutate()
                setShowDeleteDialog(false)
              }}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
