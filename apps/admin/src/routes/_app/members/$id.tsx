import { createFileRoute, Link } from '@tanstack/react-router'
import { trpc } from '@/utils/trpc'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Mail, Phone, Calendar, MapPin, User as UserIcon, Home } from 'lucide-react'
import Loader from '@/components/loader'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'

export const Route = createFileRoute('/_app/members/$id')({
  loader: async ({ context, params }) => {
    await context.queryClient.prefetchQuery(
      context.trpc.admin.members.get.queryOptions({ id: params.id })
    )
  },
  component: MemberDetailPage,
})

function MemberDetailPage() {
  const { id } = Route.useParams()
  const membersQuery = useQuery(trpc.admin.members.get.queryOptions({ id }))

  if (membersQuery.isLoading) {
    return <Loader />
  }

  const member = membersQuery.data

  if (!member) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-xl font-bold">Member not found</h2>
        <Button asChild variant="link" className="mt-2">
          <Link to="/members">Back to Member List</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon">
          <Link to="/members">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Member Details</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardContent className="pt-6 text-center space-y-4">
            <Avatar className="h-24 w-24 mx-auto">
              <AvatarImage src={member.user?.image ?? undefined} />
              <AvatarFallback className="text-2xl">
                {member.user?.name?.slice(0, 2).toUpperCase() ?? 'MB'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{member.user?.name ?? member.email}</CardTitle>
              <CardDescription>Member since {new Date(member.user?.createdAt ?? "").toLocaleDateString()}</CardDescription>
            </div>
            {member.userId && (
              <div className="pt-2">
                <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                  Registered User
                </span>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Contact and profile details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Email</span>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{member.email}</span>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground uppercase font-semibold">Phone</span>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{member.profile?.phone || 'No phone provided'}</span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="font-semibold text-sm">Location Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground uppercase font-semibold">City</span>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{member.profile?.city || 'Not specified'}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground uppercase font-semibold">Address</span>
                  <div className="flex items-center gap-2">
                    <Home className="h-4 w-4 text-muted-foreground" />
                    <span>{member.profile?.address || 'No address provided'}</span>
                  </div>
                </div>
              </div>
            </div>

            {member.profile?.bio && (
              <>
                <Separator />
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground uppercase font-semibold">Bio</span>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {member.profile.bio}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
