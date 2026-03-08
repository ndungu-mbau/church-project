import { Button } from '@/components/ui/button'
import { Calendar, Trash2, ExternalLink, Edit } from 'lucide-react'
import Loader from '@/components/loader'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { trpc } from '@/utils/trpc'

interface DevotionDetailViewProps {
  id: string
  onEdit: () => void
  onRefresh: () => void
}

export function DevotionDetailView({ id, onEdit, onRefresh }: DevotionDetailViewProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const devotionQuery = useQuery(trpc.staff.devotions.get.queryOptions({ id }))

  const deleteDevotion = useMutation(trpc.staff.devotions.delete.mutationOptions({
    onSuccess: () => {
      toast.success("Devotion deleted successfully")
      queryClient.invalidateQueries({ queryKey: trpc.staff.devotions.list.queryKey() })
      navigate({ to: '/devotions' })
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete devotion")
    }
  }))

  if (devotionQuery.isLoading) {
    return <Loader />
  }

  const devotion = devotionQuery.data

  if (!devotion) {
    return (
      <div className="h-full flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-bold">Devotion not found</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1 flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{devotion.title}</h1>
          <div className="flex items-center gap-4 text-muted-foreground text-sm font-medium">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {new Date(devotion.date ?? '').toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
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
            disabled={deleteDevotion.isPending}
          >
            {showConfirmDelete ? "Cancel" : <><Trash2 className="h-4 w-4" /> Delete</>}
          </Button>
        </div>
      </div>

      {showConfirmDelete && (
        <Alert variant="destructive" className="animate-in fade-in slide-in-from-top-2 duration-300">
          <Trash2 className="h-4 w-4" />
          <AlertTitle>Are you absolutely sure?</AlertTitle>
          <AlertDescription className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span>This action cannot be undone. This will permanently delete the devotion.</span>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deleteDevotion.mutate({ id })}
              disabled={deleteDevotion.isPending}
            >
              {deleteDevotion.isPending ? "Deleting..." : "Confirm Delete"}
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Card className="border-none shadow-none bg-muted/30">
        <CardContent className="pt-6">
          <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap leading-relaxed text-foreground/90">
            {devotion.content}
          </div>
        </CardContent>
      </Card>

      {devotion.link && (
        <div className="flex items-center gap-2 pt-4">
          <span className="text-sm font-semibold uppercase text-muted-foreground">External Link:</span>
          <Button variant="link" asChild className="p-0 h-auto text-primary">
            <a href={devotion.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
              {devotion.link}
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        </div>
      )}
    </div>
  )
}
