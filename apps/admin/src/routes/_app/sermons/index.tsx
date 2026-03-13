import { createFileRoute } from '@tanstack/react-router'
import { Video, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/_app/sermons/')({
  component: SermonsIndex,
})

function SermonsIndex() {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
        <Video className="h-10 w-10 text-primary" />
      </div>
      <div className="max-w-md space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Select a Sermon</h2>
        <p className="text-muted-foreground">
          Choose a sermon from the list on the left to view details, watch the video, or update its information.
        </p>
      </div>
    </div>
  )
}
