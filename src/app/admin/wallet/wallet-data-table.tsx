'use client'

import { walletApiRequest } from "@/apiRequests/wallet"
import { formatCurrency } from "@/lib/utils"
import { WalletResType } from "@/schemaValidations/wallet.schema"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, Loader2, LockIcon, RefreshCcw } from "lucide-react"
import { WalletWithdrawDialog } from "@/components/operator/wallet/wallet-withdraw-dialog"
import { toast } from "sonner"
import Link from "next/link"

function WalletDataTable() {
    const [isLoading, setIsLoading] = useState(false)
    const [isWithdrawing, setIsWithdrawing] = useState(false)
    const [wallet, setWallet] = useState<WalletResType | undefined>(undefined)
    const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const fetchWallet = async (showToast = false) => {
        setIsLoading(true)
        setIsRefreshing(true)
        try {
            const res = await walletApiRequest.get();
            if (res.status !== 200) {
                throw new Error("Failed to fetch wallet data")
            }
            const data = await res.payload;
            setWallet(data)
            if (showToast) {
                toast.success("Đã cập nhật thông tin ví")
            }
        } catch (error) {
            console.error(error)
            toast.error("Không thể tải thông tin ví")
            setWallet(undefined)
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }
    
    useEffect(() => {
        fetchWallet()
    }, [])

    const handleRefresh = () => {
        fetchWallet(true)
    }

    const handleWithdraw = () => {
        if (!wallet || wallet.balance <= 0) {
            toast.error("Số dư không đủ để thực hiện giao dịch")
            return
        }
        
        setWithdrawDialogOpen(true)
    }

    const handleWithdrawComplete = () => {
        // Refresh wallet data after successful withdrawal
        fetchWallet()
    }

    return (
        <div className="w-full flex flex-col justify-center items-center py-4 gap-4">
            <Card className="w-full max-w-md">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-2xl font-bold">Ví của tôi</CardTitle>
                        <CardDescription>Quản lý số dư và rút tiền</CardDescription>
                    </div>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        title="Làm mới"
                    >
                        <RefreshCcw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                    </Button>
                </CardHeader>
                <CardContent>
                    {isLoading && !isRefreshing ? (
                        <div className="flex justify-center items-center h-32">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            <span className="ml-2 text-muted-foreground">Đang tải...</span>
                        </div>
                    ) : wallet ? (
                        <div className="space-y-6">
                            <div className="flex flex-col items-center p-6 bg-muted/30 rounded-lg border">
                                <p className="text-sm text-muted-foreground mb-1">Số dư hiện tại</p>
                                <p className="text-3xl font-bold text-primary">{formatCurrency(wallet.balance)}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                            <p>Không có dữ liệu</p>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                className="mt-2"
                                onClick={() => fetchWallet()}
                            >
                                Tải lại
                            </Button>
                        </div>
                    )}
                </CardContent>
                {wallet && wallet.balance > 0 && (
                    <CardFooter>
                        <Button 
                            className="w-full" 
                            onClick={handleWithdraw}
                        >
                            <ArrowDownIcon className="mr-2 h-4 w-4" />
                           Tạo Yêu Cầu Rút tiền
                        </Button>
                    </CardFooter>
                )}
            </Card>

            <Card className="w-full max-w-md">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Thiết lập xác thực OTP</CardTitle>
                        <CardDescription>Thiết lập xác thực OTP để bảo vệ giao dịch</CardDescription>
                    </div>
                    <LockIcon className="h-5 w-5 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">
                        Thiết lập xác thực OTP sẽ giúp bảo vệ giao dịch của bạn. 
                        Mỗi khi rút tiền, bạn sẽ cần nhập mã xác thực từ ứng dụng.
                    </p>
                </CardContent>
                <CardFooter>
                    <Link href="/operator/wallet/otp-setup" className="w-full">
                        <Button className="w-full" variant="outline">
                            Thiết lập xác thực OTP
                        </Button>
                    </Link>
                </CardFooter>
            </Card>

            {wallet && (
                <WalletWithdrawDialog 
                    open={withdrawDialogOpen}
                    onOpenChange={setWithdrawDialogOpen}
                    currentBalance={wallet.balance}
                    onWithdrawComplete={handleWithdrawComplete}
                />
            )}
        </div>
    )
}

export default WalletDataTable