import { createFileRoute, Link, Outlet, useLocation, useMatch } from '@tanstack/react-router'
import { trpc } from '@/utils/trpc'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Plus, ChevronRight, Video } from 'lucide-react'
import Loader from '@/components/loader'
import { cn } from '@/lib/utils'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { useState } from 'react'
import { SermonForm } from '@/components/sermons/sermon-form'
import { ScrollArea } from '@/components/ui/scroll-area'

export const Route = createFileRoute('/_app/sermons')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(context.trpc.staff.sermons.list.queryOptions())
  },
  component: SermonsLayout,
})

function SermonsLayout() {
  const { pathname, state } = useLocation()
  const isAddRoute = useMatch({ from: '/_app/sermons/add', shouldThrow: false })
  const queryClient = useQueryClient()
  const sermonsQuery = useQuery(trpc.staff.sermons.list.queryOptions())

  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const createSermon = useMutation(trpc.staff.sermons.create.mutationOptions({
    onSuccess: () => {
      toast.success("Sermon added successfully")
      setIsCreateOpen(false)
      queryClient.invalidateQueries({ queryKey: trpc.staff.sermons.list.queryKey() })
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add sermon")
    }
  }))

  const form = useForm({
    defaultValues: {
      title: '',
      videoUrl: '',
      description: '',
      category: '',
      date: new Date().toISOString(),
    },
    onSubmit: async ({ value }) => {
      await createSermon.mutateAsync(value)
    }
  })

  if (sermonsQuery.isLoading) {
    return <Loader />
  }

  const sermons = sermonsQuery.data ?? []

  // We hide the sidebar ONLY if we are on the add route and it's NOT a modal
  // This ensures that deep links to /add show the form full-screen
  const showSidebar = !isAddRoute || (state as any)?.isModal

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar / Master List */}
      {showSidebar && (
        <div className="w-80 border-r flex flex-col bg-card/50">
          <div className="p-4 border-b flex items-center justify-between shrink-0">
            <h1 className="text-xl font-bold flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              Sermons
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
            {sermons.map((sermon) => {
              const isActive = pathname.includes(`/sermons/${sermon.id}`)
              return (
                <Link
                  key={sermon.id}
                  to="/sermons/$id"
                  params={{ id: sermon.id }}
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
                        {sermon.title}
                      </p>
                      <p className={cn(
                        "text-xs truncate mt-0.5",
                        isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                      )}>
                        {new Date(sermon.date ?? "").toLocaleDateString()}
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

            {sermons.length === 0 && (
              <div className="text-center py-10 px-4">
                <p className="text-sm text-muted-foreground">No sermons found.</p>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(true)}
                  className="mt-4"
                >
                  Add Sermon
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Detail Area / Outlet */}
      <div className="flex-1 overflow-y-auto relative bg-background">
        <Outlet />
      </div>

      <Sheet open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <SheetContent className="sm:max-w-[500px]">
          <SheetHeader>
            <SheetTitle>Add Sermon</SheetTitle>
            <SheetDescription>
              Upload or link a new sermon for your congregation.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-4 h-full pb-8 px-4">
            <ScrollArea className="h-full">
              <SermonForm
                onSuccess={() => setIsCreateOpen(false)}
                onCancel={() => setIsCreateOpen(false)}
              />
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
