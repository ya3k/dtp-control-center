'use client'

import { walletApiRequest } from "@/apiRequests/wallet"
import { WalletResType } from "@/schemaValidations/wallet.schema"
import { useEffect, useState } from "react"

function WalletDataTable() {
    const [isLoading, setIsLoading] = useState(false)
    const [wallet, setWallet] = useState<WalletResType | undefined>(undefined)

    useEffect(() => {
        const fetchWallet = async () => {
            setIsLoading(true)
            try {
                const res = await walletApiRequest.get();
                if (res.status !== 200) {
                    throw new Error("Failed to fetch wallet data")
                }
                const data = await res.payload;
                setWallet(data)
            } catch (error) {
                console.log(error)
                setWallet(undefined)
            } finally {
                setIsLoading(false)
            }
        }

        fetchWallet()
    }, [])

    return (
        <div className="overflow-hidden rounded-md border border-slate-200 shadow-md">
            <table className="w-full table-auto">
                <thead>
                    <tr>
                        <th className="px-4 py-2 text-left">User ID</th>
                        <th className="px-4 py-2 text-left">Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={2} className="px-4 py-2 text-center">Loading...</td>
                        </tr>
                    ) : wallet ? (
                        <tr>
                            <td className="px-4 py-2">{wallet.userId}</td>
                            <td className="px-4 py-2">{wallet.balance}</td>
                        </tr>
                    ) : (   
                        <tr>
                            <td colSpan={2} className="px-4 py-2 text-center">No data available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default WalletDataTable