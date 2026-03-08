import { createFileRoute, useNavigate, useSearch } from '@tanstack/react-router'
import { SermonDetailView } from '@/components/sermons/sermon-detail-view'
import { SermonEditForm } from '@/components/sermons/sermon-edit-form'
import { useQuery } from '@tanstack/react-query'
import { trpc } from '@/utils/trpc'
import Loader from '@/components/loader'

export const Route = createFileRoute('/_app/sermons/$id')({
  loader: async ({ context, params }) => {
    await context.queryClient.prefetchQuery(
      context.trpc.staff.sermons.get.queryOptions({ id: params.id })
    )
  },
  validateSearch: (search: any) => ({
    edit: search?.edit === "true" || search?.edit === true,
  }),
  component: SermonDetail,
})

function SermonDetail() {
  const { id } = Route.useParams()
  const { edit } = useSearch({ from: '/_app/sermons/$id' })
  const navigate = useNavigate({ from: '/_app/sermons/$id' })

  const sermonQuery = useQuery(
    trpc.staff.sermons.get.queryOptions({ id })
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
    sermonQuery.refetch()
  }

  if (sermonQuery.isLoading) {
    return <Loader />
  }

  return edit ? (
    <SermonEditForm
      id={id}
      onSuccess={handleEditSuccess}
      onCancel={handleCancelEdit}
    />
  ) : (
    <SermonDetailView
      id={id}
      onEdit={handleEdit}
      onRefresh={handleRefresh}
    />
  )
}
