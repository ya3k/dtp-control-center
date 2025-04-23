// "use client"
// import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { Plus, Trash2, Loader2, Pencil } from "lucide-react"
// import { useState } from "react"

// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import {
//   type CreateTourBodyType,
//   TicketKind,
//   TicketSchema,
//   type TourCreateTicketType,
// } from "@/schemaValidations/tour-operator.shema"
// import { toast } from "sonner"

// interface TicketFormProps {
//   data: Partial<CreateTourBodyType>
//   updateData: (data: Partial<CreateTourBodyType>) => void
//   onPrevious: () => void
//   onSubmit: () => void
//   isSubmitting: boolean
// }

// // Vietnamese labels for ticket kinds
// const ticketKindLabels: Record<TicketKind, string> = {
//   [TicketKind.Adult]: "Người lớn",
//   [TicketKind.Child]: "Trẻ em",
//   [TicketKind.PerGroupOfThree]: "Nhóm 3 người",
//   [TicketKind.PerGroupOfFive]: "Nhóm 5 người",
//   [TicketKind.PerGroupOfSeven]: "Nhóm 7 người",
//   [TicketKind.PerGroupOfTen]: "Nhóm 10 người",
// };

// // Convert enum to array for rendering
// const ticketKinds = Object.keys(TicketKind)
//   .filter(key => !isNaN(Number(key)))
//   .map(key => ({
//     id: Number(key),
//     name: TicketKind[Number(key) as TicketKind],
//     label: ticketKindLabels[Number(key) as TicketKind]
//   }));

// export function TicketForm({ data, updateData, onPrevious, onSubmit, isSubmitting }: TicketFormProps) {
//   // Add state for editing
//   const [editingIndex, setEditingIndex] = useState<number | null>(null);
//   const [sortNewestFirst, setSortNewestFirst] = useState<boolean>(false);

//   const form = useForm<TourCreateTicketType>({
//     resolver: zodResolver(TicketSchema),
//     defaultValues: {
//       defaultNetCost: 0,
//       minimumPurchaseQuantity: 1,
//       ticketKind: TicketKind.Adult,
//     },
//   })

//   const addOrUpdateTicket = (values: TourCreateTicketType) => {
//     // Check for duplicate ticket type
//     const isDuplicate = data.tickets?.some((ticket, idx) => 
//       ticket.ticketKind === values.ticketKind && idx !== editingIndex
//     );

//     if (isDuplicate) {
//       toast.error("Loại vé này đã tồn tại");
//       return;
//     }

//     // Ensure the ticket data matches the schema
//     const ticketData: TourCreateTicketType = {
//       defaultNetCost: values.defaultNetCost,
//       minimumPurchaseQuantity: values.minimumPurchaseQuantity,
//       ticketKind: values.ticketKind,
//     }

//     if (editingIndex !== null) {
//       // Update existing ticket
//       const updatedTickets = [...(data.tickets || [])];
//       updatedTickets[editingIndex] = ticketData;
//       updateData({ tickets: updatedTickets });
//       setEditingIndex(null);
//       toast.success("Cập nhật vé thành công");
//     } else {
//       // Add new ticket
//       const updatedTickets = [...(data.tickets || []), ticketData];
//       updateData({ tickets: updatedTickets });
//       toast.success("Thêm vé thành công");
//     }

//     // Reset form
//     form.reset({
//       defaultNetCost: 0,
//       minimumPurchaseQuantity: 1,
//       ticketKind: TicketKind.Adult,
//     });
//   }

//   const editTicket = (index: number) => {
//     const ticket = data.tickets?.[index];
//     if (ticket) {
//       form.reset({
//         defaultNetCost: ticket.defaultNetCost,
//         minimumPurchaseQuantity: ticket.minimumPurchaseQuantity,
//         ticketKind: ticket.ticketKind,
//       });
//       setEditingIndex(index);

//       // Scroll to form for better UX
//       window.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   }

//   const cancelEdit = () => {
//     setEditingIndex(null);
//     form.reset({
//       defaultNetCost: 0,
//       minimumPurchaseQuantity: 1,
//       ticketKind: TicketKind.Adult,
//     });
//   }

//   const removeTicket = (index: number) => {
//     const updatedTickets = [...(data.tickets || [])];
//     updatedTickets.splice(index, 1);
//     updateData({ tickets: updatedTickets });

//     // Reset editing mode if the ticket being edited is removed
//     if (editingIndex === index) {
//       setEditingIndex(null);
//       form.reset({
//         defaultNetCost: 0,
//         minimumPurchaseQuantity: 1,
//         ticketKind: TicketKind.Adult,
//       });
//     } else if (editingIndex !== null && editingIndex > index) {
//       // Adjust editing index if a ticket before the one being edited is removed
//       setEditingIndex(editingIndex - 1);
//     }

//     toast.info("Ticket removed");
//   }

//   const handleSubmit = () => {
//     if ((data.tickets || []).length === 0) {
//       form.setError("ticketKind", {
//         type: "manual",
//         message: "Add at least one ticket before submitting",
//       });
//       return;
//     }
//     onSubmit();
//   }

//   // Get ticket kind name by ID
//   const getTicketKindName = (id: TicketKind) => {
//     return ticketKindLabels[id] || "Loại vé không xác định";
//   }

//   // Sort function
//   const sortTickets = (tickets: TourCreateTicketType[]) => {
//     if (sortNewestFirst) {
//       return [...tickets].reverse();
//     }
//     return [...tickets];
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h2 className="text-2xl font-bold">Vé</h2>
//         <p className="text-muted-foreground">Thêm loại vé.</p>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//         <Card className="md:sticky md:top-4 h-fit">
//           <CardHeader>
//             <CardTitle>{editingIndex !== null ? 'Chỉnh sửa vé' : 'Thêm vé'}</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <Form {...form}>
//               <form onSubmit={form.handleSubmit(addOrUpdateTicket)} className="space-y-4">
//                 <FormField
//                   control={form.control}
//                   name="ticketKind"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Loại vé</FormLabel>
//                       <Select
//                         onValueChange={(value) => field.onChange(Number.parseInt(value))}
//                         defaultValue={field.value.toString()}
//                         value={field.value.toString()}
//                       >
//                         <FormControl>
//                           <SelectTrigger>
//                             <SelectValue placeholder="Chọn loại vé" />
//                           </SelectTrigger>
//                         </FormControl>
//                         <SelectContent>
//                           {ticketKinds.map((kind) => (
//                             <SelectItem key={kind.id} value={kind.id.toString()}>
//                               {kind.label}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="defaultNetCost"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Giá cơ bản</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           step="0.01"
//                           min="0.01"
//                           {...field}
//                           onChange={(e) => field.onChange(Number.parseFloat(e.target.value))}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <FormField
//                   control={form.control}
//                   name="minimumPurchaseQuantity"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel>Số lượng vé mua tối thiểu</FormLabel>
//                       <FormControl>
//                         <Input
//                           type="number"
//                           min="1"
//                           {...field}
//                           onChange={(e) => field.onChange(Number.parseInt(e.target.value))}
//                         />
//                       </FormControl>
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />

//                 <div className={editingIndex !== null ? "grid grid-cols-2 gap-2" : ""}>
//                   <Button type="submit" className="w-full">
//                     {editingIndex !== null ? 'Lưu chỉnh sửa' : (
//                       <>
//                         <Plus className="mr-2 h-4 w-4" />
//                         Thêm vé
//                       </>
//                     )}
//                   </Button>

//                   {editingIndex !== null && (
//                     <Button
//                       type="button"
//                       variant="outline"
//                       className="w-full"
//                       onClick={cancelEdit}
//                     >
//                       Ngưng chỉnh sửa
//                     </Button>
//                   )}
//                 </div>
//               </form>
//             </Form>
//           </CardContent>
//         </Card>

//         <div className="space-y-4">
//           <Card>
//             <CardHeader>
//               <CardTitle>Danh sách vé</CardTitle>
//             </CardHeader>
//             <CardContent>
//               <div className="flex items-center justify-between">
//                 <CardTitle>Thêm vé</CardTitle>
//                 {(data.tickets?.length ?? 0) > 1 && (
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setSortNewestFirst(!sortNewestFirst)}
//                   >
//                     {sortNewestFirst ? "Mặc định" : "Xếp theo mới nhất"}
//                   </Button>
//                 )}
//               </div>
//               <div>
//                 <p className="text-sm">
//                   {data.tickets?.length || 0} vé đã được thêm
//                 </p>
//               </div>
//               {(!data.tickets || data.tickets.length === 0) && (
//                 <p className="text-sm text-muted-foreground mt-2">
//                   Không có loại vé nào. Hãy thêm vé.
//                 </p>
//               )}
//               {data.tickets && data.tickets.length > 0 && (
//                 <CardContent className="flex-1 overflow-auto max-h-[70vh]">
//                   <div className="space-y-4 pr-2">
//                     {sortTickets(data.tickets).map((ticket, index) => {
//                       // Find original index if sorted
//                       const originalIndex = sortNewestFirst
//                         ? data.tickets!.length - 1 - index
//                         : index;

//                       return (
//                         <div
//                           key={originalIndex}
//                           className={`flex items-center justify-between p-4 border rounded-md ${editingIndex === originalIndex ? "border-primary bg-primary/5" : ""
//                             }`}
//                         >
//                           <div>
//                             <div className="flex items-center">
//                               <p className="font-medium">{getTicketKindName(ticket.ticketKind)}</p>
//                               {editingIndex === originalIndex && (
//                                 <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
//                                   Chỉnh sửa
//                                 </span>
//                               )}
//                             </div>
//                             <p className="text-sm text-muted-foreground">Giá: {ticket.defaultNetCost.toLocaleString('vi-VN')} VND</p>
//                             <p className="text-sm text-muted-foreground">Số lượng tối thiểu: {ticket.minimumPurchaseQuantity}</p>
//                           </div>
//                           <div className="flex space-x-2">
//                             <Button
//                               variant="outline"
//                               size="icon"
//                               onClick={() => editTicket(originalIndex)}
//                             >
//                               <Pencil />
//                             </Button>
//                             <Button
//                               variant="ghost"
//                               size="icon"
//                               onClick={() => removeTicket(originalIndex)}
//                             >
//                               <Trash2 className="h-4 w-4" />
//                             </Button>
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </CardContent>
//               )}
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       <div className="flex justify-between">
//         <Button variant="outline" onClick={onPrevious}>
//           Trước: Địa điểm
//         </Button>
//         <Button onClick={handleSubmit} disabled={isSubmitting}>
//           {isSubmitting ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Đang tạo Tour...
//             </>
//           ) : (
//             "Tạo tour ngay"
//           )}
//         </Button>
//       </div>
//     </div>
//   )
// }

