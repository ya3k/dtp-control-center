'use client'

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input';
import { TicketSchema, POSTTourTicketType, TicketKind } from '@/schemaValidations/crud-tour.schema';
import useTourStore from '@/store/tourStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { z } from 'zod';

const ticketKindLabels: Record<TicketKind, string> = {
  [TicketKind.Adult]: "Người lớn",
  [TicketKind.Child]: "Trẻ em",
  [TicketKind.PerGroupOfThree]: "Nhóm 3 người",
  [TicketKind.PerGroupOfFive]: "Nhóm 5 người",
  [TicketKind.PerGroupOfSeven]: "Nhóm 7 người",
  [TicketKind.PerGroupOfTen]: "Nhóm 10 người",
};

export default function TourTicketForm() {
  const { nextStep, prevStep, formData } = useTourStore();
  const [error, setError] = useState<string>("");
  const [tickets, setTickets] = useState<POSTTourTicketType[]>(formData.tickets || []);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useForm<POSTTourTicketType>({
    resolver: zodResolver(TicketSchema),
    defaultValues: {
      defaultNetCost: 0,
      minimumPurchaseQuantity: 1,
      ticketKind: TicketKind.Adult,
    }
  });

  const addOrUpdateTicket = (data: POSTTourTicketType) => {
    if (editingIndex !== null) {
      // Update existing ticket
      const newTickets = [...tickets];
      newTickets[editingIndex] = data;
      setTickets(newTickets);
      setEditingIndex(null);
    } else {
      // Check if ticket type already exists
      if (tickets.some(ticket => ticket.ticketKind === data.ticketKind)) {
        setError("Loại vé này đã tồn tại");
        return;
      }
      setTickets([...tickets, data]);
    }
    setError("");
    form.reset();
  };

  const startEditing = (index: number) => {
    const ticketToEdit = tickets[index];
    form.reset(ticketToEdit);
    setEditingIndex(index);
  };

  const cancelEditing = () => {
    setEditingIndex(null);
    form.reset();
  };

  const removeTicket = (index: number) => {
    if (editingIndex === index) {
      cancelEditing();
    }
    const newTickets = tickets.filter((_, idx) => idx !== index);
    setTickets(newTickets);
    setError("");
  };

  const validateAndNext = () => {
    try {
      z.array(TicketSchema).min(1, "Phải có ít nhất một loại vé").parse(tickets);
      setError("");
      useTourStore.setState(state => ({
        formData: {
          ...state.formData,
          tickets: tickets
        }
      }));
      nextStep();
    } catch (err: unknown) {
      const error = err as z.ZodError;
      setError(error.errors?.[0]?.message || "Vui lòng điền đầy đủ thông tin vé.");
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        {/* Left side - Add Ticket Form */}
        <Card>
          <CardHeader>
            <CardTitle>Thêm loại vé mới</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(addOrUpdateTicket)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="ticketKind"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại vé</FormLabel>
                      <Select
                        value={field.value.toString()}
                        onValueChange={(value) => field.onChange(parseInt(value) as TicketKind)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại vé" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {Object.entries(ticketKindLabels).map(([value, label]) => (
                            <SelectItem key={value} value={value}>
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="defaultNetCost"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá vé</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Giá vé cho mỗi người/nhóm
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minimumPurchaseQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Số lượng vé mua tối thiểu</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value))}
                        />
                      </FormControl>
                      <FormDescription>
                        Số lượng vé tối thiểu cần mua
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}

                />
                <div className='text-sm italic font-light text-black-600'><span>Số lượng mặc định của mỗi vé là <span className='font-bold text-red-600'>100</span> có thể chỉnh sửa sau khi tạo tour thành công</span></div>
                <div className="flex space-x-2">

                  <Button type="submit" className="flex-1">
                    {editingIndex !== null ? "Cập nhật" : "Thêm vé"}
                  </Button>
                  {editingIndex !== null && (
                    <Button type="button" variant="outline" onClick={cancelEditing}>
                      Hủy
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Right side - Ticket List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách vé</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 text-sm font-medium text-destructive">
                *{error}
              </div>
            )}

            <div className="space-y-4">
              {tickets.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  Chưa có loại vé nào được thêm
                </div>
              ) : (
                tickets.map((ticket, index) => (
                  <Card key={index}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="font-medium">{ticketKindLabels[ticket.ticketKind]}</h3>
                          <p className="text-sm text-muted-foreground">
                            Giá: {formatCurrency(ticket.defaultNetCost)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Số lượng tối thiểu: {ticket.minimumPurchaseQuantity}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(index)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTicket(index)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-between space-x-4">
        <Button type="button" variant="outline" onClick={prevStep}>
          Quay lại
        </Button>
        <Button type="button" onClick={validateAndNext}>
          Tiếp theo
        </Button>
      </div>
    </div>
  );
}
