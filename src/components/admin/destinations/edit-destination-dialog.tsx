import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from 'sonner'
import { useDestinationStore } from '@/store/destination/useDestinationStore'

export interface Destination {
    id: string;
    name: string;
    createdBy: string;
    createdAt: string;
    lastModified?: string;
    lastModifiedBy?: string;
    isDeleted: boolean;
}

interface EditDestinationDialogProps {
  destination: Destination | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const destinationFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
})

type DestinationFormValues = z.infer<typeof destinationFormSchema>

function EditDestinationDialog({ destination, open, onOpenChange }: EditDestinationDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
    const { updateDestination } = useDestinationStore();
  
  const form = useForm<DestinationFormValues>({
    resolver: zodResolver(destinationFormSchema),
    defaultValues: {
      name: ""
    },
  })

  useEffect(() => {
    if (destination) {
      form.reset({
        name: destination.name
      })
    }
  }, [destination, form]);

  async function onSubmit(data: DestinationFormValues) {
    if (!destination) return;
    setIsSubmitting(true);
    try {
      await updateDestination(destination.id, data);
      toast.success(`${destination.name} is update to ${data.name}`);
      onOpenChange(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update destination");
    } finally {
      setIsSubmitting(false);
    }
  }
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Destination</DialogTitle>
          <DialogDescription>Update destination details. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Destination Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditDestinationDialog;
