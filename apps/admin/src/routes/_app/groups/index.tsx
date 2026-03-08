
import { createFileRoute } from '@tanstack/react-router'
import { UsersRound } from 'lucide-react'

export const Route = createFileRoute('/_app/groups/')({
  component: GroupsIndex,
})

function GroupsIndex() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
      <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <UsersRound className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-medium text-foreground">Select a Group</h3>
      <p className="max-w-sm mt-2">
        Select a group from the sidebar to view details, members, and manage settings.
      </p>
    </div>
  )
}
