import { createFileRoute, Link } from '@tanstack/react-router'
import { trpc } from '@/utils/trpc'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, MoreHorizontal, Mail, Phone, User as UserIcon } from 'lucide-react'
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

export const Route = createFileRoute('/_app/staff/')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(context.trpc.admin.staff.list.queryOptions())
  },
  component: StaffPage,
})

function StaffPage() {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const staffQuery = useQuery(trpc.admin.staff.list.queryOptions())

  const createStaff = useMutation(trpc.admin.staff.create.mutationOptions({
    onSuccess: () => {
      toast.success("Staff member created successfully")
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: trpc.admin.staff.list.queryKey() })
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create staff member")
    }
  }))

  const form = useForm({
    defaultValues: {
      email: '',
      role: 'staff' as 'staff' | 'pastor' | 'admin',
      position: '',
      department: '',
    },
    onSubmit: async ({ value }) => {
      await createStaff.mutateAsync(value)
    }
  })

  if (staffQuery.isLoading) {
    return <Loader />
  }

  const staff = staffQuery.data ?? []

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Staff Management</h1>
          <p className="text-muted-foreground">
            Manage your church staff and their roles.
          </p>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Staff
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Add Staff Member</SheetTitle>
              <SheetDescription>
                Invite a new staff member to your church. They will be notified via email.
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
                          placeholder="pastor@church.com"
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

                <form.Field name="position">
                  {(field) => (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Position</FieldLabel>
                      <FieldContent>
                        <Input
                          id={field.name}
                          placeholder="Lead Pastor / Administrator"
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

                <div className="grid grid-cols-2 gap-4">
                  <form.Field name="role">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>System Role</FieldLabel>
                        <FieldContent>
                          <select
                            id={field.name}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value as any)}
                          >
                            <option value="staff">Staff</option>
                            <option value="pastor">Pastor</option>
                            <option value="admin">Admin</option>
                          </select>
                        </FieldContent>
                        <FieldError errors={field.state.meta.errors} />
                      </Field>
                    )}
                  </form.Field>

                  <form.Field name="department">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Department</FieldLabel>
                        <FieldContent>
                          <Input
                            id={field.name}
                            placeholder="Operations"
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
              </div>

              <SheetFooter className="pt-4 border-t">
                <Button type="submit" className="w-full" disabled={createStaff.isPending}>
                  {createStaff.isPending ? "Adding..." : "Add Staff Member"}
                </Button>
              </SheetFooter>
            </form>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {staff.map((member) => (
          <Card key={member.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <Link to="/staff/$id" params={{ id: member.id }}>
                <Avatar className="h-12 w-12 hover:opacity-80 transition-opacity">
                  <AvatarImage src={member.user?.image ?? undefined} />
                  <AvatarFallback>
                    {member.user?.name?.slice(0, 2).toUpperCase() ?? 'ST'}
                  </AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex flex-col">
                <Link to="/staff/$id" params={{ id: member.id }} className="hover:underline">
                  <CardTitle className="text-lg">{member.user?.name ?? member.email}</CardTitle>
                </Link>
                <CardDescription className="capitalize">{member.position}</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm space-y-2">
                <div className="flex items-center text-muted-foreground">
                  <Mail className="mr-2 h-4 w-4" />
                  {member.email}
                </div>
                {member.user?.id && (
                  <div className="flex items-center text-muted-foreground gap-1">
                    <span className="bg-primary/20 text-primary text-[10px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wider">
                      Registered
                    </span>
                  </div>
                )}
              </div>
              <div className="flex justify-end">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link to="/staff/$id" params={{ id: member.id }}>View Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                    <DropdownMenuItem>Change Role</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => {
                        if (confirm("Are you sure you want to remove this staff member?")) {
                          // Implement delete mutation
                        }
                      }}
                    >
                      Remove Staff
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {staff.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground">No staff members found.</p>
          <Button variant="link" className="mt-2" onClick={() => setOpen(true)}>Add your first staff member</Button>
        </div>
      )}
    </div>
  )
}
