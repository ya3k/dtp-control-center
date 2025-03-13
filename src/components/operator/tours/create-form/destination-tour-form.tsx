"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateTourBodyType, DestinationSchema, TourCreateDestinationType } from "@/schemaValidations/tour-operator.shema"
import { apiEndpoint } from "@/configs/routes"

interface DestinationFormProps {
  data: Partial<CreateTourBodyType>
  updateData: (data: Partial<CreateTourBodyType>) => void
  onNext: () => void
  onPrevious: () => void
}

interface Destination {
  id: string
  name: string
}

export function DestinationForm({ data, updateData, onNext, onPrevious }: DestinationFormProps) {
  const [destinations, setDestinations] = useState<Destination[]>([
  ])

  const fetchDestination = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}${apiEndpoint.destination}`, {
        headers: { "Content-Type": "application/json" }
      })
      const data = await response.json()
      setDestinations(data)
    } catch (error) {
      console.error("Failed to fetch destinations:", error)
    }
  }

  useEffect(() => {
    fetchDestination()
  }, [])
  const form = useForm<TourCreateDestinationType>({
    resolver: zodResolver(DestinationSchema),
    defaultValues: {
      destinationId: "",
      startTime: "09:00:00",
      endTime: "10:00:00",
      sortOrder: data.destinations?.length ? data.destinations.length + 1 : 0,
      sortOrderByDate: data.destinations?.length ? data.destinations.length + 1 : 0,
      img: "string"
    },
  })

  const addDestination = (values: TourCreateDestinationType) => {
    const updatedDestinations = [...(data.destinations || []), values]
    updateData({ destinations: updatedDestinations })

    // Reset form with incremented sort orders
    form.reset({
      destinationId: "",
      startTime: "09:00:00",
      endTime: "10:00:00",
      sortOrder: updatedDestinations.length - 1 + 1,
      sortOrderByDate: updatedDestinations.length - 1 + 1,
      
    })
  }

  const removeDestination = (index: number) => {
    const updatedDestinations = [...(data.destinations || [])]
    updatedDestinations.splice(index, 1)

    // Update sort orders
    const reorderedDestinations = updatedDestinations.map((dest, idx) => ({
      ...dest,
      sortOrder: idx + 1,
      sortOrderByDate: idx + 1,
    }))

    updateData({ destinations: reorderedDestinations })
  }

  const handleContinue = () => {
    if ((data.destinations || []).length === 0) {
      form.setError("destinationId", {
        type: "manual",
        message: "Add at least one destination before continuing",
      })
      return
    }
    onNext()
  }

  // Find destination name by ID
  const getDestinationName = (id: string) => {
    const destination = destinations.find((d) => d.id === id)
    return destination ? destination.name : "Unknown Destination"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Destinations</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(addDestination)} className="space-y-4">
              <FormField
                control={form.control}
                name="destinationId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination</FormLabel>
                    <FormControl>
                      <select
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        {...field}
                      >
                        <option value="">Select a destination</option>
                        {destinations.map((destination) => (
                          <option key={destination.id} value={destination.id}>
                            {destination.name}
                          </option>
                        ))}
                      </select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Time (HH:MM:SS)</FormLabel>
                      <FormControl>
                        <Input type="time" step="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Time (HH:MM:SS)</FormLabel>
                      <FormControl>
                        <Input type="time" step="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="sortOrder"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sortOrderByDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sort Order By Date</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="w-full" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add Destination
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {(data.destinations || []).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Added Destinations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.destinations?.map((destination, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <p className="font-medium">{getDestinationName(destination.destinationId)}</p>
                    <p className="text-sm text-muted-foreground">
                      {destination.startTime} - {destination.endTime}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeDestination(index)}>
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
          Previous: Tour Info
        </Button>
        <Button onClick={handleContinue}>Next: Tickets</Button>
      </div>
    </div>
  )
}

