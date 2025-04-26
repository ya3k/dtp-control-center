"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle, Loader2 } from "lucide-react"
import type { CompanyResType } from "@/schemaValidations/company.schema"
import companyApiRequest from "@/apiRequests/company"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "sonner"
import envConfig from "@/configs/envConfig"
import { links } from "@/configs/routes"

interface ApproveCompanyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApprovalComplete: () => void
}

export function ApproveCompanyDialog({ open, onOpenChange, onApprovalComplete }: ApproveCompanyDialogProps) {
  const [pendingCompanies, setPendingCompanies] = useState<CompanyResType[]>([])
  const [loading, setLoading] = useState(false)
  const [approvingIds, setApprovingIds] = useState<Set<string>>(new Set())

  // Fetch pending companies when dialog opens
  useEffect(() => {
    if (open) {
      fetchPendingCompanies()
    }
  }, [open])

  const fetchPendingCompanies = async () => {
    setLoading(true)
    try {
      // Build OData query to get only unlicensed companies
      const params = new URLSearchParams()
      params.append("$filter", "licensed eq false")
      params.append("$count", "true")

      const queryString = `?${params.toString()}`
      console.log(queryString)
      const response = await companyApiRequest.getWithOData(queryString)

      setPendingCompanies(response.payload?.value || [])
    } catch (error) {
      console.error("Error fetching pending companies:", error)
      toast.error("Không thể tải danh sách công ty đang chờ duyệt")
    } finally {
      setLoading(false)
    }
  }

  // Update the handleApproveCompany function to use the correct request body format
  const handleApproveCompany = async (company: CompanyResType) => {
    if (!company.id) return

    // Add company ID to approving set
    setApprovingIds((prev) => new Set(prev).add(company.id!))

    try {
      // Call API to approve company with the correct request body format
      console.log(JSON.stringify(
        {
          companyId: company.id,
          confirmUrl: `${envConfig.NEXT_PUBLIC_BASE_URL}/company/${company.id}`,
          accept: true,
        }
      ))
      const respones = await companyApiRequest.approve({
        companyId: company.id,
        confirmUrl: `${envConfig.NEXT_PUBLIC_BASE_URL}${links.companyConfirm.href}`,
        accept: true,
      })
      // console.log(`Request body: `, JSON.stringify(respones))
      // console.log(JSON.stringify(respones))

      // Remove from pending list
      setPendingCompanies((prev) => prev.filter((c) => c.id !== company.id))

      // Show success toast
      toast.success(`Đã duyệt công ty ${company.name}`)

      // If no more pending companies, close dialog
      if (pendingCompanies.length === 1) {
        setTimeout(() => {
          onOpenChange(false)
        }, 1500)
      }

      // Notify parent component to refresh main list
      onApprovalComplete()
    } catch (error) {
      console.error("Error approving company:", error)
      toast.error("Không thể duyệt công ty")

      // Don't remove from the list on error, but refresh to get latest state
      await fetchPendingCompanies()
    } finally {
      // Always remove the company ID from the approving set, whether successful or not
      setApprovingIds((prev) => {
        const newSet = new Set(prev)
        newSet.delete(company.id!)
        return newSet
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Duyệt đăng ký công ty</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Đang tải danh sách công ty...</span>
            </div>
          ) : pendingCompanies.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>Không có công ty nào đang chờ duyệt</p>
            </div>
          ) : (
            <ScrollArea className="h-[500px] pr-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên công ty</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Số điện thoại</TableHead>
                    <TableHead>Mã số thuế</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingCompanies.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.name}</TableCell>
                      <TableCell>{company.email}</TableCell>
                      <TableCell>{company.phone}</TableCell>
                      <TableCell>{company.taxCode}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-yellow-100 text-red-600 border-yellow-200 font-bold">
                          Chờ duyệt
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          onClick={() => handleApproveCompany(company)}
                          disabled={approvingIds.has(company.id!)}
                          size="sm"

                          className="gap-1 font-semibold"
                          variant={"approve"}
                        >
                          {approvingIds.has(company.id!) ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Đang duyệt
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4 " />
                              Duyệt
                            </>
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

