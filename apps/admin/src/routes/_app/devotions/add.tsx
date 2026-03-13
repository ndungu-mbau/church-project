import { createFileRoute } from '@tanstack/react-router'
import { DevotionForm } from '@/components/devotions/devotion-form'

export const Route = createFileRoute('/_app/devotions/add')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DevotionForm />
}
