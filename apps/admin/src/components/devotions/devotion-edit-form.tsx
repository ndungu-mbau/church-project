import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { trpc } from '@/utils/trpc'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon, ChevronLeft } from 'lucide-react'
import { Field, FieldContent, FieldError, FieldLabel } from '@/components/ui/field'
import { cn } from '@/lib/utils'
import { BIBLE_BOOKS } from '@/constants/bible-books'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox'
import { PlusIcon, Trash2Icon } from 'lucide-react'

interface DevotionEditFormProps {
  id: string
  onSuccess?: () => void
  onCancel?: () => void
}

export function DevotionEditForm({ id, onSuccess, onCancel }: DevotionEditFormProps) {
  const queryClient = useQueryClient()
  const devotionQuery = useQuery(trpc.staff.devotions.get.queryOptions({ id }))

  const updateDevotion = useMutation(trpc.staff.devotions.update.mutationOptions({
    onSuccess: () => {
      toast.success("Devotion updated successfully")
      queryClient.invalidateQueries({ queryKey: trpc.staff.devotions.list.queryKey() })
      queryClient.invalidateQueries({ queryKey: trpc.staff.devotions.get.queryKey({ id }) })
      onSuccess?.()
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update devotion")
    }
  }))

  const devotion = devotionQuery.data

  const form = useForm({
    defaultValues: {
      title: devotion?.title ?? '',
      content: devotion?.content ?? '',
      date: devotion?.date ? new Date(devotion.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      verses: devotion?.verses ?? ([] as { book: string; chapter: number; verses: string }[]),
      link: devotion?.link ?? '',
    },
    onSubmit: async ({ value }) => {
      await updateDevotion.mutateAsync({
        id,
        title: value.title,
        content: value.content,
        date: value.date,
        verses: value.verses,
        link: value.link || undefined,
      })
    }
  })

  if (devotionQuery.isLoading) {
    return <div className="p-8"><p>Loading...</p></div>
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onCancel}
          className="h-8 w-8"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Edit Devotion</h1>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
        className="space-y-4 flex flex-col"
      >
        <div className="flex-1 space-y-4">
          <form.Field name="title">
            {(field) => (
              <Field>
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
              <Field>
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
                        onSelect={(date: Date | undefined) => field.handleChange(date?.toISOString() ?? '')}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </FieldContent>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          </form.Field>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium">Bible Verses</h3>
              <form.Field name="verses" mode="array">
                {(field) => (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => field.pushValue({ book: '', chapter: 1, verses: '' })}
                  >
                    <PlusIcon className="mr-2 h-4 w-4" />
                    Add Verse
                  </Button>
                )}
              </form.Field>
            </div>

            <form.Field name="verses" mode="array">
              {(field) => (
                <div className="space-y-4">
                  {field.state.value.map((_, i) => (
                    <div key={i} className="flex gap-2 items-start bg-muted/30 p-4 rounded-lg border">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                        <form.Field name={`verses[${i}].book`}>
                          {(bookField) => (
                            <Field>
                              <FieldLabel>Book</FieldLabel>
                              <FieldContent>
                                <Combobox
                                  value={bookField.state.value}
                                  onValueChange={(val) => bookField.handleChange(val as string)}
                                >
                                  <ComboboxInput placeholder="Select book..." />
                                  <ComboboxContent>
                                    <ComboboxList>
                                      <ComboboxEmpty>No book found.</ComboboxEmpty>
                                      {BIBLE_BOOKS.map((book) => (
                                        <ComboboxItem key={book} value={book}>
                                          {book}
                                        </ComboboxItem>
                                      ))}
                                    </ComboboxList>
                                  </ComboboxContent>
                                </Combobox>
                              </FieldContent>
                              <FieldError errors={bookField.state.meta.errors} />
                            </Field>
                          )}
                        </form.Field>

                        <form.Field name={`verses[${i}].chapter`}>
                          {(chapterField) => (
                            <Field>
                              <FieldLabel>Chapter</FieldLabel>
                              <FieldContent>
                                <Input
                                  type="number"
                                  placeholder="1"
                                  value={chapterField.state.value}
                                  onChange={(e) => chapterField.handleChange(parseInt(e.target.value) || 1)}
                                />
                              </FieldContent>
                              <FieldError errors={chapterField.state.meta.errors} />
                            </Field>
                          )}
                        </form.Field>

                        <form.Field name={`verses[${i}].verses`}>
                          {(versesField) => (
                            <Field>
                              <FieldLabel>Verses</FieldLabel>
                              <FieldContent>
                                <Input
                                  placeholder="1-5"
                                  value={versesField.state.value}
                                  onChange={(e) => versesField.handleChange(e.target.value)}
                                />
                              </FieldContent>
                              <FieldError errors={versesField.state.meta.errors} />
                            </Field>
                          )}
                        </form.Field>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="mt-8 text-destructive"
                        onClick={() => field.removeValue(i)}
                      >
                        <Trash2Icon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </form.Field>

            <form.Field name="link">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>External Link</FieldLabel>
                  <FieldContent>
                    <Input
                      id={field.name}
                      type="url"
                      placeholder="https://example.com"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                  </FieldContent>
                  <FieldError errors={field.state.meta.errors} />
                </Field>
              )}
            </form.Field>

            <form.Field name="content">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Content</FieldLabel>
                  <FieldContent>
                    <Textarea
                      id={field.name}
                      placeholder="Type your devotion message here..."
                      className="min-h-[200px]"
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
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t mt-4">
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" className="flex-1" disabled={updateDevotion.isPending}>
            {updateDevotion.isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  )
}
