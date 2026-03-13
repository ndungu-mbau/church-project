import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { trpc } from '@/utils/trpc'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from 'sonner'
import Loader from '@/components/loader'

interface AddMemberFormProps {
  groupId: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function AddMemberForm({ groupId, onSuccess, onCancel }: AddMemberFormProps) {
  const queryClient = useQueryClient()
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [isConfirming, setIsConfirming] = useState(false)

  const availableMembersQuery = useQuery(
    trpc.admin.groups.getAvailableMembers.queryOptions({ groupId })
  )

  const addMember = useMutation(
    trpc.admin.groups.addMember.mutationOptions({
      onSuccess: () => {
        toast.success('Member added to group')
        queryClient.invalidateQueries({
          queryKey: trpc.admin.groups.getMembers.queryKey({ groupId }),
        })
        queryClient.invalidateQueries({
          queryKey: trpc.admin.groups.getAvailableMembers.queryKey({ groupId }),
        })
        setSelectedUserId('')
        onSuccess?.()
      },
      onError: (error: any) => {
        toast.error(error.message || 'Failed to add member')
      },
    })
  )

  const handleAddMember = async () => {
    if (!selectedUserId) {
      toast.error('Please select a member')
      return
    }

    const selectedUser = availableMembersQuery.data?.find(
      (u) => u.id === selectedUserId
    )

    if (!selectedUser) return

    await addMember.mutateAsync({
      groupId,
      userId: selectedUserId,
    })

    setIsConfirming(false)
  }

  if (availableMembersQuery.isLoading) {
    return <Loader />
  }

  if (availableMembersQuery.error) {
    return (
      <div className="p-4 text-sm text-destructive">
        Failed to load available members
      </div>
    )
  }

  const availableMembers = availableMembersQuery.data ?? []

  if (availableMembers.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        <p>All members are already in this group.</p>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="member-select" className="text-sm font-medium">
            Select Member to Add
          </label>
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger id="member-select">
              <SelectValue placeholder="Choose a member..." />
            </SelectTrigger>
            <SelectContent>
              {availableMembers.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.name || user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 justify-end pt-4">
          <Button variant="outline" onClick={onCancel} disabled={addMember.isPending}>
            Cancel
          </Button>
          <Button
            onClick={() => setIsConfirming(true)}
            disabled={!selectedUserId || addMember.isPending}
          >
            {addMember.isPending ? 'Adding...' : 'Add Member'}
          </Button>
        </div>
      </div>

      <AlertDialog open={isConfirming} onOpenChange={setIsConfirming}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Member to Group?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to add {availableMembers.find((u) => u.id === selectedUserId)?.name || selectedUserId} to this group?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-2 justify-end">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleAddMember}>
              {addMember.isPending ? 'Adding...' : 'Add'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
