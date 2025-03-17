"use client"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateTourBodyType, TicketKind, TicketSchema, TourCreateTicketType } from "@/schemaValidations/tour-operator.shema"


interface TicketFormProps {
  data: Partial<CreateTourBodyType>
  updateData: (data: Partial<CreateTourBodyType>) => void
  onPrevious: () => void
  onSubmit: () => void
  isSubmitting: boolean
}

// Convert enum to array for rendering
const ticketKinds = Object.entries(TicketKind)
  .filter(([key]) => isNaN(Number(key)))
  .map(([key, value]) => ({ id: TicketKind[key as keyof typeof TicketKind], name: key }))

export function TicketForm({ data, updateData, onPrevious, onSubmit, isSubmitting }: TicketFormProps) {
  const form = useForm<TourCreateTicketType>({
    resolver: zodResolver(TicketSchema),
    defaultValues: {
      defaultNetCost: 0,
      minimumPurchaseQuantity: 1,
      ticketKind: TicketKind.Adult,
    },
  })

  const addTicket = (values: TourCreateTicketType) => {
    const updatedTickets = [...(data.tickets || []), values]
    updateData({ tickets: updatedTickets })

    // Reset form
    form.reset({
      defaultNetCost: 0,
      minimumPurchaseQuantity: 1,
      ticketKind: TicketKind.Adult,
    })
  }

  const removeTicket = (index: number) => {
    const updatedTickets = [...(data.tickets || [])]
    updatedTickets.splice(index, 1)
    updateData({ tickets: updatedTickets })
  }

  const handleSubmit = () => {
    if ((data.tickets || []).length === 0) {
      form.setError("ticketKind", {
        type: "manual",
        message: "Add at least one ticket before submitting",
      })
      return
    }
    onSubmit()
  }

  // Get ticket kind name by ID
  const getTicketKindName = (id: TicketKind) => {
    const kind = ticketKinds.find((k) => k.id === id)
    return kind ? kind.name : "Unknown Ticket Type"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(addTicket)} className="space-y-4">
              <FormField
                control={form.control}
                name="ticketKind"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket Type</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number.parseInt(value))}
                      defaultValue={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select ticket type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ticketKinds.map((kind) => (
                          <SelectItem key={kind.id} value={kind.id.toString()}>
                            {kind.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="defaultNetCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Net Cost</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="defaultTax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tax</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

              </div>

              <FormField
                control={form.control}
                name="minimumPurchaseQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Purchase Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Ticket
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(data.tickets || []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Added Tickets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.tickets?.map((ticket, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <p className="font-medium">{getTicketKindName(ticket.ticketKind)}</p>
                    <p className="text-sm text-muted-foreground">
                      Price: ${ticket.defaultNetCost.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">Min. Quantity: {ticket.minimumPurchaseQuantity}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeTicket(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrevious}>
          Previous: Destinations
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating Tour...
            </>
          ) : (
            "Create Tour"
          )}
        </Button>
      </div>
    </div>
  )
}