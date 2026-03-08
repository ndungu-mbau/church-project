import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { trpc } from '@/utils/trpc'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
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

interface DevotionFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function DevotionForm({ onSuccess, onCancel }: DevotionFormProps) {
  const queryClient = useQueryClient()

  const createDevotion = useMutation(trpc.staff.devotions.create.mutationOptions({
    onSuccess: () => {
      toast.success("Devotion created successfully")
      queryClient.invalidateQueries({ queryKey: trpc.staff.devotions.list.queryKey() })
      onSuccess?.()
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
      verses: [] as { book: string; chapter: number; verses: string }[],
    },
    onSubmit: async ({ value }) => {
      await createDevotion.mutateAsync(value)
    }
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="space-y-4 flex flex-col h-full"
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
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
            Cancel
          </Button>
        )}
        <Button type="submit" className="flex-1" disabled={createDevotion.isPending}>
          {createDevotion.isPending ? "Creating..." : "Create Devotion"}
        </Button>
      </div>
    </form>
  )
}
