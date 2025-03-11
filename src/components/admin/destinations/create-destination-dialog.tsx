import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { CreateDestinationBodySchema, CreateDestinationBodyType } from "@/schemaValidations/admin-destination.schema";
import { useDestinationStore } from "@/store/destination/useDestinationStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";



function CreateDestinationDialog() {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createDestination } = useDestinationStore();
  const form = useForm<CreateDestinationBodyType>({
    resolver: zodResolver(CreateDestinationBodySchema),
    defaultValues: {
      name: "",
      latitude: "0", // Vĩ độ: -90 -> 90
      longitude: "0", // Kinh độ: -180 -> 180
    },
  });

  const resetForm = () => {
    form.reset();
  };

  async function onSubmit(data: CreateDestinationBodyType) {
    setIsSubmitting(true);
    try {
      console.log("New Destination:", JSON.stringify(data));
      await createDestination(data);
      toast.success("Điểm đến được tạo thành công!");
      form.reset();
      setOpen(false);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Không thể tạo điểm đến");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          <span>Thêm điểm đến</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm điểm đến mới</DialogTitle>
          <DialogDescription>Nhập thông tin điểm đến</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            {/* Tên điểm đến */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên điểm đến</FormLabel>
                  <FormControl>
                    <Input placeholder="Hà Nội, Paris, Tokyo..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Vĩ độ */}
            <FormField
              control={form.control}
              name="latitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vĩ Độ</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập Vĩ Độ"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            {/* Kinh độ */}
            <FormField
              control={form.control}
              name="longitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kinh Độ</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nhập Kinh Độ"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Người tạo
            <FormField
              control={form.control}
              name="createdBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Người tạo</FormLabel>
                  <FormControl>
                    <Input placeholder="Tên người tạo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <DialogFooter>
              <Button type="reset" variant="outline" onClick={resetForm}>
                Xóa Form
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang tạo...
                  </>
                ) : (
                  "Thêm điểm đến"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CreateDestinationDialog;
