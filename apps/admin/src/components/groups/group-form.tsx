
import { useForm } from '@tanstack/react-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { trpc } from '@/utils/trpc'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface GroupFormProps {
  initialValues?: {
    name: string
    description?: string
    leaderId?: string | null
  }
  onSubmit: (values: { name: string; description?: string; leaderId?: string | null }) => Promise<void>
  isSubmitting?: boolean
  onCancel?: () => void
}

export function GroupForm({ initialValues, onSubmit, isSubmitting, onCancel }: GroupFormProps) {
  const membersQuery = useQuery(trpc.admin.members.list.queryOptions())

  const form = useForm({
    defaultValues: initialValues || {
      name: '',
      description: '',
      leaderId: null,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4"
    >
      <form.Field
        name="name"
        validators={{
          onChange: ({ value }) => !value ? 'Name is required' : undefined,
        }}
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Name</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
            {field.state.meta.errors ? (
              <p className="text-sm text-destructive">{field.state.meta.errors.join(', ')}</p>
            ) : null}
          </div>
        )}
      />

      <form.Field
        name="description"
        children={(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Description</Label>
            <Textarea
              id={field.name}
              name={field.name}
              value={field.state.value || ''}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      />

      <form.Field
        name="leaderId"
        children={(field) => (
          <div className="space-y-2">
            <Label>Group Leader</Label>
            <Select
              value={field.state.value || '__none__'}
              onValueChange={(value) => field.handleChange(value === '__none__' ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a leader (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">No Leader (You will be assigned)</SelectItem>
                {membersQuery.data?.filter(member => member.userId).map((member) => (
                  <SelectItem key={member.id} value={member.userId!}>
                    {member.user?.name || member.user?.email || 'Unknown'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Leave empty to automatically assign yourself as the leader
            </p>
          </div>
        )}
      />

      <div className="flex justify-end gap-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save
        </Button>
      </div>
    </form>
  )
}
