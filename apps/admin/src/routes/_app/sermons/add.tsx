import { SermonForm } from '@/components/sermons/sermon-form'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/sermons/add')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SermonForm />
}
