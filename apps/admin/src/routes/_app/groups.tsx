
import { createFileRoute, Link, Outlet, useMatch } from '@tanstack/react-router'
import { trpc } from '@/utils/trpc'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Plus, ChevronRight, UsersRound } from 'lucide-react'
import Loader from '@/components/loader'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { toast } from 'sonner'
import { useState } from 'react'
import { GroupForm } from '@/components/groups/group-form'
import { ScrollArea } from '@/components/ui/scroll-area'

export const Route = createFileRoute('/_app/groups')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(context.trpc.admin.groups.list.queryOptions())
  },
  component: GroupsLayout,
})

function GroupsLayout() {
  const match = useMatch({ from: '/_app/groups/$groupId', shouldThrow: false })
  const activeGroupId = match?.params.groupId

  const queryClient = useQueryClient()
  const groupsQuery = useQuery(trpc.admin.groups.list.queryOptions())

  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const createGroup = useMutation(trpc.admin.groups.create.mutationOptions({
    onSuccess: () => {
      toast.success("Group created successfully")
      setIsCreateOpen(false)
      queryClient.invalidateQueries({ queryKey: trpc.admin.groups.list.queryKey() })
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create group")
    }
  }))

  if (groupsQuery.isLoading) {
    return <Loader />
  }

  const groups = groupsQuery.data ?? []

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar / Master List */}
      <div className="w-80 border-r flex flex-col bg-card/50">
        <div className="p-4 border-b flex items-center justify-between shrink-0">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <UsersRound className="h-5 w-5 text-primary" />
            Groups
          </h1>
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8"
            onClick={() => setIsCreateOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {groups.map((group) => {
            const isActive = activeGroupId === group.id
            return (
              <Link
                key={group.id}
                to="/groups/$groupId"
                params={{ groupId: group.id }}
                className={cn(
                  "block p-3 rounded-lg transition-colors group",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">
                      {group.name}
                    </p>
                    <p className={cn(
                      "text-xs truncate mt-0.5",
                      isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      {group.leader ? `${group.leader.name}` : 'No Leader'}
                    </p>
                  </div>
                  <ChevronRight className={cn(
                    "h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5",
                    isActive ? "text-primary-foreground" : "text-muted-foreground"
                  )} />
                </div>
              </Link>
            )
          })}

          {groups.length === 0 && (
            <div className="text-center py-10 px-4">
              <p className="text-sm text-muted-foreground">No groups found.</p>
              <Button
                variant="outline"
                onClick={() => setIsCreateOpen(true)}
                className="mt-4"
              >
                Create Group
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Detail Area / Outlet */}
      <div className="flex-1 overflow-y-auto relative bg-background">
        <Outlet />
      </div>

      <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <SheetContent className="sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Create Group</SheetTitle>
            <SheetDescription>
              Create a new small group or ministry team.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 h-full pb-8 px-4">
            <ScrollArea className="h-full">
              <GroupForm
                onSubmit={async (values) => {
                  await createGroup.mutateAsync(values)
                }}
                onCancel={() => setIsCreateOpen(false)}
                isSubmitting={createGroup.isPending}
              />
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
