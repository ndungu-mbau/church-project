import { createFileRoute, Link } from '@tanstack/react-router'
import { trpc } from '@/utils/trpc'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, MoreHorizontal, Mail, Phone, User as UserIcon, MapPin } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Loader from '@/components/loader'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet"
import { Input } from '@/components/ui/input'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { useState } from 'react'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'

export const Route = createFileRoute('/_app/members/')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(context.trpc.admin.members.list.queryOptions())
  },
  component: MembersPage,
})

function MembersPage() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const membersQuery = useQuery(trpc.admin.members.list.queryOptions())

  const createMember = useMutation(trpc.admin.members.create.mutationOptions({
    onSuccess: () => {
      toast.success("Member added successfully")
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: trpc.admin.members.list.queryKey() })
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to add member")
    }
  }))

  const form = useForm({
    defaultValues: {
      email: '',
      phone: '',
    },
    onSubmit: async ({ value }) => {
      await createMember.mutateAsync(value)
    }
  })

  if (membersQuery.isLoading) {
    return <Loader />
  }

  const members = membersQuery.data ?? []

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Members</h1>
          <p className="text-muted-foreground">
            Manage your church members and their profiles.
          </p>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Member
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add New Member</SheetTitle>
              <SheetDescription>
                Add a member to your church registry.
              </SheetDescription>
            </SheetHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
              }}
              className="space-y-4 py-4 h-full flex flex-col"
            >
              <div className="flex-1 space-y-4">
                <form.Field name="email">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                      <FieldContent>
                        <Input
                          id={field.name}
                          type="email"
                          placeholder="member@example.com"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          required
                        />
                      </FieldContent>
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>

                <form.Field name="phone">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Phone Number (Optional)</FieldLabel>
                      <FieldContent>
                        <Input
                          id={field.name}
                          placeholder="+254 700 000 000"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                        />
                      </FieldContent>
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                </form.Field>
              </div>

              <SheetFooter className="pt-4 border-t">
                <Button type="submit" className="w-full" disabled={createMember.isPending}>
                  {createMember.isPending ? "Adding..." : "Add Member"}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="divide-y border rounded-lg overflow-hidden bg-card shadow-sm">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={member.user?.image ?? undefined} />
                <AvatarFallback>
                  {member.user?.name?.slice(0, 2).toUpperCase() ?? 'MB'}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="font-medium text-foreground">{member.user?.name ?? member.email}</span>
                <span className="text-sm text-muted-foreground">{member.email}</span>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground font-medium">
              {member.profile?.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-primary" />
                  {member.profile.phone}
                </div>
              )}
              {member.profile?.city && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {member.profile.city}
                </div>
              )}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                  <Link to="/members/$id" params={{ id: member.id }}>View Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>Edit Details</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Remove Member</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ))}

        {members.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No members found.</p>
            <Button variant="link" className="mt-2 text-primary" onClick={() => setOpen(true)}>Add your first member</Button>
          </div>
        )}
      </div>
    </div>
  )
}
