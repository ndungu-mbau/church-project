import { createFileRoute, Link, Outlet, useLocation, useMatch } from '@tanstack/react-router'
import { trpc } from '@/utils/trpc'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Plus, ChevronRight, BookOpen } from 'lucide-react'
import Loader from '@/components/loader'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { DevotionForm } from '@/components/devotions/devotion-form'

export const Route = createFileRoute('/_app/devotions')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(context.trpc.staff.devotions.list.queryOptions())
  },
  component: DevotionsLayout,
})

function DevotionsLayout() {
  const { pathname, state } = useLocation()
  const isAddRoute = useMatch({ from: '/_app/devotions/add', shouldThrow: false })
  const devotionsQuery = useQuery(trpc.staff.devotions.list.queryOptions())
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  if (devotionsQuery.isLoading) {
    return <Loader />
  }

  const devotions = devotionsQuery.data ?? []

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
              <BookOpen className="h-5 w-5 text-primary" />
              Devotions
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
            {devotions.map((devotion) => {
              const isActive = pathname.includes(`/devotions/${devotion.id}`)
              return (
                <Link
                  key={devotion.id}
                  to="/devotions/$id"
                  params={{ id: devotion.id }}
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
                        {devotion.title}
                      </p>
                      <p className={cn(
                        "text-xs truncate mt-0.5",
                        isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                      )}>
                        {new Date(devotion.date ?? "").toLocaleDateString()}
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

            {devotions.length === 0 && (
              <div className="text-center py-10 px-4">
                <p className="text-sm text-muted-foreground">No devotions found.</p>
                <Button
                  variant="link"
                  size="sm"
                  className="mt-2 text-primary"
                  onClick={() => setIsCreateOpen(true)}
                >
                  Create your first one
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
        <SheetContent className="sm:max-w-xl w-full overflow-y-auto px-4">
          <SheetHeader>
            <SheetTitle>Create Devotion</SheetTitle>
          </SheetHeader>
          <div className="mt-4 h-full pb-8">
            <DevotionForm
              onSuccess={() => setIsCreateOpen(false)}
              onCancel={() => setIsCreateOpen(false)}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
