import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { DevotionDetailView } from '@/components/devotions/devotion-detail-view'
import { DevotionEditForm } from '@/components/devotions/devotion-edit-form'
import { useQuery } from '@tanstack/react-query'
import { trpc } from '@/utils/trpc'
import Loader from '@/components/loader'

export const Route = createFileRoute('/_app/devotions/$id')({
  loader: async ({ context, params }) => {
    await context.queryClient.prefetchQuery(
      context.trpc.staff.devotions.get.queryOptions({ id: params.id })
    )
  },
  validateSearch: (search: any) => ({
    edit: search?.edit === "true" || search?.edit === true,
  }),
  component: DevotionDetail,
})

function DevotionDetail() {
  const { id } = Route.useParams()
  const { edit } = useSearch({ from: '/_app/devotions/$id' })
  const navigate = useNavigate({ from: '/_app/devotions/$id' })

  const devotionQuery = useQuery(
    trpc.staff.devotions.get.queryOptions({ id })
  )

  const handleEdit = () => {
    navigate({
      search: (prev) => ({ ...prev, edit: true }),
    })
  }

  const handleCancelEdit = () => {
    navigate({
      search: (prev) => {
        const { edit, ...rest } = prev
        return rest
      },
    })
  }

  const handleEditSuccess = () => {
    navigate({
      search: (prev) => {
        const { edit, ...rest } = prev
        return rest
      },
    })
  }

  const handleRefresh = () => {
    devotionQuery.refetch()
  }

  if (devotionQuery.isLoading) {
    return <Loader />
  }

  return edit ? (
    <DevotionEditForm
      id={id}
      onSuccess={handleEditSuccess}
      onCancel={handleCancelEdit}
    />
  ) : (
    <DevotionDetailView
      id={id}
      onEdit={handleEdit}
      onRefresh={handleRefresh}
    />
  )
}
