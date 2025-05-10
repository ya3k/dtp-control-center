"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, Search } from "lucide-react"
import { toast } from "sonner"
import { walletApiRequest } from "@/apiRequests/wallet"
import { BankInfoType, WithDrawSchema, WithDrawType } from "@/schemaValidations/wallet.schema"
import { formatCurrency } from "@/lib/utils"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import http from "@/lib/http"
import Image from "next/image"

interface WalletWithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentBalance: number;
  onWithdrawComplete: () => void;
}

export function WalletWithdrawDialog({
  open,
  onOpenChange,
  currentBalance,
  onWithdrawComplete
}: WalletWithdrawDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bankInfoList, setBankInfoList] = useState<BankInfoType[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const form = useForm<WithDrawType>({
    resolver: zodResolver(WithDrawSchema),
    defaultValues: {
      amount: 5000,
      bankAccountNumber: "",
      bankName: "",
      bankAccount: "",
      otp: "",
    }
  })

  const fetchBankInfo = async () => {
    try {
      const response = await walletApiRequest.getBankList();
      const data = response.data;
      // console.log(data)
      setBankInfoList(data)
      // console.log(JSON.stringify(bankInfoList))

    } catch (error) {
      console.error("Error fetching bank info:", error)
      toast.error("Lỗi khi lấy thông tin ngân hàng")
    }
  }

  useEffect(() => {
    if (open) {
      fetchBankInfo()
    }
  }, [open])

  const filteredBanks = bankInfoList.filter(bank =>
    bank.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bank.short_name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Handle form submission
  const onSubmit = async (data: WithDrawType) => {
    if (data.amount > currentBalance) {
      form.setError("amount", {
        type: "manual",
        message: "Số tiền rút không được vượt quá số dư hiện tại"
      })
      return
    }

    setIsSubmitting(true)
    try {
      // Using the withdrawWithOTP function that accepts OTP
      // console.log(JSON.stringify(data))
      const response = await walletApiRequest.withdrawWithOTP(data, data.otp)
      if (response.status === 200) {
        toast.success("Yêu cầu rút tiền thành công")
        onOpenChange(false)
        form.reset()
        onWithdrawComplete()
      } else {
        throw new Error("Rút tiền thất bại")
      }
    } catch (error) {
      console.error("Error withdrawing:", error)
      toast.error("Không thể rút tiền. Vui lòng thử lại sau.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle dialog close
  const handleClose = () => {
    if (!isSubmitting) {
      form.reset()
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Rút tiền</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4 py-2">
              <div className="bg-muted/30 p-4 rounded-md mb-4">
                <p className="text-sm text-muted-foreground">Số dư hiện tại</p>
                <p className="text-xl font-semibold">{formatCurrency(currentBalance)}</p>
              </div>

              <FormField
                control={form.control}
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Chọn ngân hàng</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn ngân hàng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <div className="flex items-center px-3 pb-2">
                          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                          <Input
                            placeholder="Tìm kiếm ngân hàng..."
                            className="h-8"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                          />
                        </div>
                        {filteredBanks.map((bank) => (
                          <SelectItem key={bank.id} value={bank.short_name}>
                            <div className="flex items-center">
                              {bank.logo_url && (
                                <Image
                                  src={bank.logo_url}
                                  alt={bank.name}
                                  className="w-6 h-6 mr-2"
                                  width={24}
                                  height={24}
                                />
                              )}
                              <span>{bank.name} - {bank.short_name}</span>
                            </div>
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
                name="bankAccountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số tài khoản ngân hàng</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập số tài khoản ngân hàng"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bankAccount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên tài khoản ngân hàng</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nhập tên tài khoản ngân hàng"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số tiền muốn rút</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Nhập số tiền"
                        {...field}
                        onChange={e => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Số tiền tối thiểu là 100,000 VNĐ
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã OTP</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Nhập mã OTP"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  'Xác nhận'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}