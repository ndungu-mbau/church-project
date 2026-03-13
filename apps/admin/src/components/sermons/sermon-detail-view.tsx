import { Button } from '@/components/ui/button'
import { Calendar, Trash2, ExternalLink, Edit, Tag, Video } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { trpc } from '@/utils/trpc'

interface SermonDetailViewProps {
  id: string
  onEdit: () => void
  onRefresh: () => void
}

export function SermonDetailView({ id, onEdit, onRefresh }: SermonDetailViewProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const sermonQuery = useQuery(trpc.staff.sermons.get.queryOptions({ id }))
  const confirmDeleteButtonRef = useRef<HTMLButtonElement>(null)

  // Manage focus when delete confirmation appears
  useEffect(() => {
    if (showConfirmDelete && confirmDeleteButtonRef.current) {
      confirmDeleteButtonRef.current.focus()
    }
  }, [showConfirmDelete])

  const deleteSermon = useMutation(trpc.staff.sermons.delete.mutationOptions({
    onSuccess: () => {
      toast.success("Sermon deleted successfully")
      queryClient.invalidateQueries({ queryKey: trpc.staff.sermons.list.queryKey() })
      navigate({ to: '/sermons' })
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete sermon")
    }
  }))

  if (sermonQuery.isLoading) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            <Skeleton className="h-8 w-3/4" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-20" />
          </div>
        </div>
        <Card className="overflow-hidden">
          <CardHeader className="pb-4">
            <Skeleton className="h-5 w-32" />
          </CardHeader>
          <CardContent className="p-0 bg-black aspect-video" />
        </Card>
        <Card className="bg-muted/30">
          <CardHeader>
            <Skeleton className="h-5 w-40" />
          </CardHeader>
          <CardContent className="pt-0 pb-6">
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const sermon = sermonQuery.data

  if (!sermon) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-bold">Sermon not found</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{sermon.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(sermon.date ?? '').toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
            {sermon.category && (
              <span className="flex items-center gap-1.5">
                <Tag className="h-4 w-4" />
                {sermon.category}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {!showConfirmDelete && (
            <Button variant="outline" size="sm" className="gap-2" onClick={onEdit}>
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          )}
          <Button
            variant="destructive"
            size="sm"
            className="gap-2"
            onClick={() => setShowConfirmDelete(!showConfirmDelete)}
            disabled={deleteSermon.isPending}
          >
            {showConfirmDelete ? "Cancel" : <><Trash2 className="h-4 w-4" /> Delete</>}
          </Button>
        </div>
      </div>

      {showConfirmDelete && (
        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-300" role="alert" aria-live="assertive">
          <Trash2 className="h-4 w-4" />
          <AlertTitle>Are you absolutely sure?</AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span>This action cannot be undone. This will permanently delete the sermon from the registry.</span>
            <Button
              variant="destructive"
              size="sm"
              ref={confirmDeleteButtonRef}
              onClick={() => deleteSermon.mutate({ id })}
              disabled={deleteSermon.isPending}
              aria-label="Confirm sermon deletion"
            >
              {deleteSermon.isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Keyboard event handler for delete confirmation */}
      <div
        onKeyDown={(e) => {
          if (showConfirmDelete && e.key === 'Escape') {
            setShowConfirmDelete(false)
          }
        }}
      />

      <div className="grid gap-6">
        {sermon.link && (
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="bg-muted/50 pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Sermon Video
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 bg-black aspect-video flex items-center justify-center">
              <a
                href={sermon.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center gap-4 text-white hover:text-primary transition-colors"
              >
                <div className="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-primary group-hover:scale-110 transition-all">
                  <Video className="h-8 w-8 fill-current" />
                </div>
                <span className="font-semibold text-lg">Watch on External Platform</span>
                <div className="flex items-center gap-1.5 text-sm text-zinc-400 group-hover:text-white transition-colors">
                  {sermon.link}
                  <ExternalLink className="h-3 w-3" />
                </div>
              </a>
            </CardContent>
          </Card>
        )}

        {sermon.content && (
          <Card className="border-none shadow-none bg-muted/30">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-wider text-muted-foreground">Description</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 pb-6">
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-foreground/90 font-medium">
                {sermon.content}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
