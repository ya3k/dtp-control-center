'use client'

import { walletApiRequest } from "@/apiRequests/wallet"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"



export function OtpQrSetup() {
  const [isLoading, setIsLoading] = useState(false)
  const [otpQrData, setOtpQrData] = useState<string | null>(null)

  const fetchOtpQr = async () => {
    setIsLoading(true)
    try {
      const res = await walletApiRequest.getOtp();
      if (res.status !== 200) {
        throw new Error("Failed to fetch OTP QR data")
      }
      // console.log(JSON.stringify(res))
      const data = await res.payload.message;
      setOtpQrData(data)
    } catch (error) {
      // console.error(error)
      toast.error("Không thể tải mã QR xác thực. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }
  
  useEffect(() => {
    fetchOtpQr()
  }, [])

  const handleRefresh = () => {
    fetchOtpQr()
  }

  return (
    <div className="w-full flex justify-center items-start py-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Thiết lập xác thực với otp</CardTitle>
          <CardDescription>
            Quét mã QR với ứng dụng xác thực của bạn để bảo mật tài khoản
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Đang tải mã QR...</span>
            </div>
          ) : otpQrData ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center">
                <div className="relative w-64 h-64 border rounded-md overflow-hidden">
                  {otpQrData && (
                    <Image 
                      src={otpQrData} 
                      alt="QR Code for authenticator app" 
                      fill
                      className="object-contain p-2"
                      priority
                    />
                  )}
                </div>
              </div>
              
              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Thông tin quan trọng</AlertTitle>
                <AlertDescription>
                  <p className="mt-2">Quét mã QR với Google Authenticator, Microsoft Authenticator hoặc ứng dụng xác thực tương tự.</p>
                </AlertDescription>
              </Alert>
              
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <p>Không có dữ liệu mã QR</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={handleRefresh}
              >
                Thử lại
              </Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <p className="text-sm text-muted-foreground text-center">
            Sau khi thiết lập, bạn sẽ cần nhập mã xác thực từ ứng dụng mỗi khi thực hiện giao dịch rút tiền.
          </p>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Tạo lại mã QR
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}