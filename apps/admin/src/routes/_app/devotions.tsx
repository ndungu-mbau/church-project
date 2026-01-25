import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router'
import { trpc } from '@/utils/trpc'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { Plus, ChevronRight, BookOpen } from 'lucide-react'
import Loader from '@/components/loader'
import { cn } from '@/lib/utils'
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
import { Textarea } from '@/components/ui/textarea'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'

export const Route = createFileRoute('/_app/devotions')({
  loader: async ({ context }) => {
    await context.queryClient.prefetchQuery(context.trpc.staff.devotions.list.queryOptions())
  },
  component: DevotionsLayout,
})

function DevotionsLayout() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const queryClient = useQueryClient()
  const devotionsQuery = useQuery(trpc.staff.devotions.list.queryOptions())

  const createDevotion = useMutation(trpc.staff.devotions.create.mutationOptions({
    onSuccess: () => {
      toast.success("Devotion created successfully")
      setOpen(false)
      queryClient.invalidateQueries({ queryKey: trpc.staff.devotions.list.queryKey() })
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create devotion")
    }
  }))

  const form = useForm({
    defaultValues: {
      title: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      link: '',
    },
    onSubmit: async ({ value }) => {
      await createDevotion.mutateAsync(value)
    }
  })

  if (devotionsQuery.isLoading) {
    return <Loader />
  }

  const devotions = devotionsQuery.data ?? []

  return (
    <div className="flex h-full overflow-hidden">
      {/* Sidebar / Master List */}
      <div className="w-80 border-r flex flex-col bg-card/50">
        <div className="p-4 border-b flex items-center justify-between shrink-0">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Devotions
          </h1>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="h-8 w-8">
                <Plus className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="sm:max-w-[500px]">
              <SheetHeader>
                <SheetTitle>Create Devotion</SheetTitle>
                <SheetDescription>
                  Share a new devotion with your church members.
                </SheetDescription>
              </SheetHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  form.handleSubmit()
                }}
                className="space-y-4 py-4 flex-1 flex flex-col"
              >
                <div className="flex-1 space-y-4">
                  <form.Field name="title">
                    {(field) => (
                      <Field className="px-4">
                        <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                        <FieldContent>
                          <Input
                            id={field.name}
                            placeholder="Morning Grace"
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

                  <form.Field name="date">
                    {(field) => (
                      <Field className="px-4">
                        <FieldLabel htmlFor={field.name}>Publish Date</FieldLabel>
                        <FieldContent>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !field.state.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.state.value ? (
                                  format(new Date(field.state.value), "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.state.value ? new Date(field.state.value) : undefined}
                                onSelect={(date) => field.handleChange(date?.toISOString() ?? '')}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FieldContent>
                        <FieldError errors={field.state.meta.errors} />
                      </Field>
                    )}
                  </form.Field>

                  <form.Field name="content">
                    {(field) => (
                      <Field className="px-4">
                        <FieldLabel htmlFor={field.name}>Content</FieldLabel>
                        <FieldContent>
                          <Textarea
                            id={field.name}
                            placeholder="Type your devotion message here..."
                            className="min-h-[300px]"
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

                  <form.Field name="link">
                    {(field) => (
                      <Field className="px-4">
                        <FieldLabel htmlFor={field.name}>External Link (Optional)</FieldLabel>
                        <FieldContent>
                          <Input
                            id={field.name}
                            placeholder="https://example.com/audio"
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

                <SheetFooter className="p-4 border-t">
                  <Button type="submit" className="w-full" disabled={createDevotion.isPending}>
                    {createDevotion.isPending ? "Creating..." : "Create Devotion"}
                  </Button>
                </SheetFooter>
              </form>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {devotions.map((devotion) => {
            const isActive = pathname.includes(`/devotions/${devotion.id}`)
            return (
              <Link
                key={devotion.id}
                to="/devotions/$id"
                params={{ id: devotion.id }}
                className={cn(
                  "block p-3 rounded-lg transition-colors group",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">
                      {devotion.title}
                    </p>
                    <p className={cn(
                      "text-xs truncate mt-0.5",
                      isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      {new Date(devotion.date ?? "").toLocaleDateString()}
                    </p>
                  </div>
                  <ChevronRight className={cn(
                    "h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5",
                    isActive ? "text-primary-foreground" : "text-muted-foreground"
                  )} />
                </div>
              </Link>
            )
          })}

          {devotions.length === 0 && (
            <div className="text-center py-10 px-4">
              <p className="text-sm text-muted-foreground">No devotions found.</p>
              <Button variant="link" size="sm" className="mt-2 text-primary">
                Create your first one
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Detail Area / Outlet */}
      <div className="flex-1 overflow-y-auto relative bg-background">
        <Outlet />
      </div>
    </div>
  )
}
