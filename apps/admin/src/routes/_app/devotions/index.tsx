import { createFileRoute } from '@tanstack/react-router'
import { BookOpen, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_app/devotions/')({
  component: DevotionsIndex,
})

function DevotionsIndex() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
        <BookOpen className="h-10 w-10 text-primary" />
      </div>
      <div className="max-w-md space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Select a Devotion</h2>
        <p className="text-muted-foreground">
          Choose a devotion from the list on the left to view details, or create a new one to share with your church.
        </p>
      </div>
      <Button className="gap-2">
        <Plus className="h-4 w-4" />
        Create New Devotion
      </Button>
    </div>
  )
}
