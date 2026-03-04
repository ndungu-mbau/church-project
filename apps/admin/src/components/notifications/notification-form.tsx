import { useState } from 'react'
import { trpc } from '@/utils/trpc'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useToast } from '@/components/ui/use-toast'

const notificationSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  content: z.string().min(1, 'Content is required'),
  type: z.enum(['ANNOUNCEMENT', 'EVENT', 'DONATION', 'SYSTEM_ALERT', 'OTHER']),
  priority: z.enum(['DEFAULT', 'IMPORTANT', 'URGENT']),
  isChurchWide: z.boolean().default(true),
  groupId: z.string().optional(),
})

type NotificationFormData = z.infer<typeof notificationSchema>

interface NotificationFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function NotificationForm({ onSuccess, onCancel }: NotificationFormProps) {
  const { toast } = useToast()
  const [isChurchWide, setIsChurchWide] = useState(true)
  
  // Fetch groups for dropdown
  const groupsQuery = useQuery(trpc.admin.groups.list.queryOptions())
  
  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      title: '',
      content: '',
      type: 'ANNOUNCEMENT',
      priority: 'DEFAULT',
      isChurchWide: true,
    },
  })

  const createMutation = useMutation({
    mutationFn: (data: NotificationFormData) =>
      trpc.admin.notifications.create.mutate(data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Notification created successfully',
      })
      form.reset()
      onSuccess?.()
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create notification',
        variant: 'destructive',
      })
    },
  })

  const onSubmit = (data: NotificationFormData) => {
    // Clear groupId if church-wide
    const submitData = {
      ...data,
      groupId: isChurchWide ? undefined : data.groupId,
    }
    createMutation.mutate(submitData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Notification title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Notification content"
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="ANNOUNCEMENT">Announcement</SelectItem>
                  <SelectItem value="EVENT">Event</SelectItem>
                  <SelectItem value="DONATION">Donation</SelectItem>
                  <SelectItem value="SYSTEM_ALERT">System Alert</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="DEFAULT">Default</SelectItem>
                  <SelectItem value="IMPORTANT">Important</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">Target</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={isChurchWide}
                  onChange={() => {
                    setIsChurchWide(true)
                    form.setValue('isChurchWide', true)
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
                    setIsChurchWide(false)
                    form.setValue('isChurchWide', false)
                  }}
                  className="rounded"
                />
                <span className="text-sm">Group</span>
              </label>
            </div>
          </div>

          {!isChurchWide && (
            <FormField
              control={form.control}
              name="groupId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Group</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a group..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {groupsQuery.data?.map((group) => (
                        <SelectItem key={group.id} value={group.id}>
                          {group.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <div className="flex gap-2 pt-4">
          <Button
            type="submit"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Create Notification'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  )
}
