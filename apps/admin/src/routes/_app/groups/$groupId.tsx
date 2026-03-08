
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { trpc } from '@/utils/trpc'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import {
  MoreHorizontal,
  Settings,
  Trash2,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  ShieldCheck
} from 'lucide-react'
import Loader from '@/components/loader'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { useState } from 'react'
import { GroupForm } from '@/components/groups/group-form'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AddMemberForm } from '@/components/groups/add-member-form'

export const Route = createFileRoute('/_app/groups/$groupId')({
  component: GroupDetail,
})

function GroupDetail() {
  const { groupId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)

  const groupQuery = useQuery(trpc.admin.groups.get.queryOptions({ id: groupId }))
  const membersQuery = useQuery(trpc.admin.groups.getMembers.queryOptions({ groupId }))

  const updateGroup = useMutation(trpc.admin.groups.update.mutationOptions({
    onSuccess: () => {
      toast.success("Group updated successfully")
      setIsEditOpen(false)
      queryClient.invalidateQueries({ queryKey: trpc.admin.groups.get.queryKey({ id: groupId }) })
      queryClient.invalidateQueries({ queryKey: trpc.admin.groups.list.queryKey() })
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update group")
    }
  }))

  const deleteGroup = useMutation(trpc.admin.groups.delete.mutationOptions({
    onSuccess: () => {
      toast.success("Group deleted successfully")
      setIsDeleteOpen(false)
      queryClient.invalidateQueries({ queryKey: trpc.admin.groups.list.queryKey() })
      navigate({ to: '/groups' })
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete group")
    }
  }))

  const removeMember = useMutation(trpc.admin.groups.removeMember.mutationOptions({
    onSuccess: () => {
      toast.success("Member removed from group")
      queryClient.invalidateQueries({ queryKey: trpc.admin.groups.getMembers.queryKey({ groupId }) })
      queryClient.invalidateQueries({ queryKey: trpc.admin.groups.getAvailableMembers.queryKey({ groupId }) })
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to remove member")
    }
  }))

  if (groupQuery.isLoading) {
    return <Loader />
  }

  if (groupQuery.error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <p>Group not found</p>
        <Button variant="link" onClick={() => navigate({ to: '/groups' })}>Go back</Button>
      </div>
    )
  }

  const group = groupQuery.data
  const members = membersQuery.data ?? []

  return (
    <div className="flex flex-col h-full">
      {/* Top Management Panel */}
      <div className="p-6 border-b bg-muted/10">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">{group?.name}</h1>
            <p className="text-muted-foreground max-w-2xl">
              {group?.description || "No description provided."}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings className="h-4 w-4" />
                Manage
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
                Edit Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setIsDeleteOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Group
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-6 mt-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserIcon className="h-4 w-4" />
            <span>Leader: {group?.leader ? `${group?.leader.name}` : "Unassigned"}</span>
          </div>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            <span>{members.length} Members</span>
          </div>
        </div>
      </div>

      {/* Members List */}
      <ScrollArea className="flex-1">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Group Members</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsAddMemberOpen(true)}
            >
              Add Member
            </Button>
          </div>

          <div className="divide-y border rounded-lg overflow-hidden bg-card shadow-sm">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={member.user?.image ?? undefined} />
                    <AvatarFallback>
                      {member.user?.name?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {member.user?.name}
                    </span>
                    <span className="text-sm text-muted-foreground">{member.user?.email}</span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive cursor-pointer"
                      onClick={() => {
                        if (member.userId) {
                          removeMember.mutate({ groupId, userId: member.userId })
                        }
                      }}
                      disabled={removeMember.isPending}
                    >
                      Remove from Group
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}

            {members.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No members in this group yet.</p>
                <Button variant="link" className="mt-2 text-primary">Add members</Button>
              </div>
            )}
          </div>
        </div>
      </ScrollArea>

      {/* Edit Sheet */}
      <Sheet open={isEditOpen} onOpenChange={setIsEditOpen}>
        <SheetContent className="sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Edit Group</SheetTitle>
            <SheetDescription>
              Update group details.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 h-full pb-8 px-4">
            <ScrollArea className="h-full">
              <GroupForm
                initialValues={{
                  name: group?.name || '',
                  description: group?.description || '',
                  leaderId: group?.leaderId || null,
                }}
                onSubmit={async (values) => {
                  await updateGroup.mutateAsync({
                    id: groupId,
                    ...values
                  })
                }}
                onCancel={() => setIsEditOpen(false)}
                isSubmitting={updateGroup.isPending}
              />
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>

      {/* Delete Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the group
              "{group?.name}" and remove all member associations.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteGroup.mutate({ id: groupId })}
              disabled={deleteGroup.isPending}
            >
              {deleteGroup.isPending ? "Deleting..." : "Delete Group"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Sheet */}
      <Sheet open={isAddMemberOpen} onOpenChange={setIsAddMemberOpen}>
        <SheetContent className="sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Add Member to Group</SheetTitle>
            <SheetDescription>
              Select a member to add to {group?.name}
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4">
            <AddMemberForm
              groupId={groupId}
              onSuccess={() => setIsAddMemberOpen(false)}
              onCancel={() => setIsAddMemberOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
