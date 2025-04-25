'use client'

import { formatPrice } from "@/lib/utils"
import { WalletResType } from "@/schemaValidations/wallet.schema"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowDownIcon, Loader2, RefreshCcw } from "lucide-react"
import { useAuthContext } from "@/providers/AuthProvider"

interface WalletBalanceCardProps {
    wallet: WalletResType | undefined
    isLoading: boolean
    isRefreshing: boolean
    onRefresh: () => void
    onWithdraw: () => void
    fetchWallet: () => void
}

export function WalletBalanceCard({
    wallet,
    isLoading,
    isRefreshing,
    onRefresh,
    onWithdraw,
    fetchWallet
}: WalletBalanceCardProps) {
    const { user } = useAuthContext();
    
    return (
        <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="text-2xl font-bold">Ví của tôi</CardTitle>
                    <CardDescription>Quản lý số dư và rút tiền</CardDescription>
                </div>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={onRefresh}
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
                            <p className="text-3xl font-bold text-primary">{formatPrice(wallet.balance)}</p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
                        <p>Không có dữ liệu</p>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={fetchWallet}
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
                        onClick={onWithdraw}
                    >
                        <ArrowDownIcon className="mr-2 h-4 w-4" />
                        Tạo Yêu Cầu Rút tiền
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
} 