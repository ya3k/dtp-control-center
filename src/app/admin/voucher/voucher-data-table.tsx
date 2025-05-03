'use client'

import { voucherApiRequest } from "@/apiRequests/voucher"
import { VoucherResType } from "@/schemaValidations/admin-voucher.schema"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Ticket } from "lucide-react"
import { toast } from "sonner"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { formatPrice } from "@/lib/utils"
import { CreateVoucherDialog } from "@/components/admin/voucher/create-voucher-dialog"

function VoucherDataTable() {
    const [isLoading, setIsLoading] = useState(false)
    const [vouchers, setVouchers] = useState<VoucherResType[]>([])
    const [createDialogOpen, setCreateDialogOpen] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const fetchVouchers = async (showToast = false) => {
        setIsLoading(true)
        setIsRefreshing(true)
        try {
            const res = await voucherApiRequest.getOdata();
            if (res.status !== 200) {
                throw new Error("Failed to fetch voucher data")
            }
            const data = await res.payload;
            setVouchers(data)
            if (showToast) {
                toast.success("Đã cập nhật danh sách voucher")
            }
        } catch (error) {
            console.error(error)
            toast.error("Không thể tải danh sách voucher")
            setVouchers([])
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }
    
    useEffect(() => {
        fetchVouchers()
    }, [])

    const handleRefresh = () => {
        fetchVouchers(true)
    }

    const handleCreateVoucher = () => {
        setCreateDialogOpen(true)
    }

    const handleCreateComplete = () => {
        // Refresh voucher data after successful creation
        fetchVouchers()
    }

    return (
        <div className="w-full flex flex-col py-4 gap-4">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold tracking-tight">Quản lý Voucher</h2>
                <div className="flex gap-2">
                    <Button 
                        onClick={handleRefresh} 
                        variant="outline" 
                        disabled={isRefreshing}
                    >
                        {isRefreshing ? "Đang tải..." : "Làm mới"}
                    </Button>
                    <Button onClick={handleCreateVoucher}>
                        <Plus className="mr-2 h-4 w-4" /> Tạo Voucher
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Danh sách Voucher</CardTitle>
                    <CardDescription>Quản lý các voucher giảm giá cho người dùng</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-40">
                            <p>Đang tải...</p>
                        </div>
                    ) : vouchers.length === 0 ? (
                        <div className="flex flex-col justify-center items-center h-40 gap-4">
                            <Ticket className="h-10 w-10 text-muted-foreground" />
                            <p>Chưa có voucher nào</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Mã Voucher</TableHead>
                                    <TableHead>Giảm giá</TableHead>
                                    <TableHead>Giảm tối đa</TableHead>
                                    <TableHead>Số lượng</TableHead>
                                    <TableHead>Còn lại</TableHead>
                                    <TableHead>Ngày hết hạn</TableHead>
                                    <TableHead>Trạng thái</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {vouchers.map((voucher) => (
                                    <TableRow key={voucher.id}>
                                        <TableCell className="font-medium">{voucher.code}</TableCell>
                                        <TableCell>{(voucher.percent * 100).toFixed(0)}%</TableCell>
                                        <TableCell>{formatPrice(voucher.maxDiscountAmount)}</TableCell>
                                        <TableCell>{voucher.quantity}</TableCell>
                                        <TableCell>{voucher.availableVoucher}</TableCell>
                                        <TableCell>{format(new Date(voucher.expiryDate), 'dd/MM/yyyy')}</TableCell>
                                        <TableCell>
                                            {new Date(voucher.expiryDate) < new Date() ? (
                                                <span className="text-red-500">Hết hạn</span>
                                            ) : voucher.availableVoucher === 0 ? (
                                                <span className="text-orange-500">Hết lượt</span>
                                            ) : (
                                                <span className="text-green-500">Còn hiệu lực</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <CreateVoucherDialog 
                open={createDialogOpen}
                onOpenChange={setCreateDialogOpen}
                onCreateComplete={handleCreateComplete}
            />
        </div>
    )
}

export default VoucherDataTable 