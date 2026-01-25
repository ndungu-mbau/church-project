import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/staff/$id')({
  component: RouteComponent,
})

function RouteComponent() {
  const { id } = Route.useParams()
  return <div>Hello "/_app/staff/{id}"!</div>
}
