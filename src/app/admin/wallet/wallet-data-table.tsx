'use client'

import { walletApiRequest } from "@/apiRequests/wallet"
import { WalletResType } from "@/schemaValidations/wallet.schema"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LockIcon } from "lucide-react"
import { WalletWithdrawDialog } from "@/components/operator/wallet/wallet-withdraw-dialog"
import { toast } from "sonner"
import Link from "next/link"
import { WalletBalanceCard } from "@/components/operator/wallet/wallet-balance-card"
import { useAuthContext } from "@/providers/AuthProvider"
import { UserRoleEnum } from "@/types/user"

function WalletDataTable() {
    const [isLoading, setIsLoading] = useState(false)
    const [wallet, setWallet] = useState<WalletResType | undefined>(undefined)
    const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const { user } = useAuthContext()
    const isAdmin = user?.roleName === UserRoleEnum.Admin

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
            <WalletBalanceCard 
                wallet={wallet}
                isLoading={isLoading}
                isRefreshing={isRefreshing}
                onRefresh={handleRefresh}
                onWithdraw={handleWithdraw}
                fetchWallet={() => fetchWallet()}
            />

            {!isAdmin && (
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
            )}

            {!isAdmin && wallet && (
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