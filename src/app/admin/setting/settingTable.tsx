"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Pencil, RefreshCcw } from "lucide-react"
import { SystemSetting } from "@/schemaValidations/system.schema"
import { toast } from "sonner"
import { EditSettingDialog } from "@/components/admin/settings/edit-setting-dialog"
import { systemSettingApiRequest } from "@/apiRequests/system-setting"


export function SettingTable() {
  const [settings, setSettings] = useState<SystemSetting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedSetting, setSelectedSetting] = useState<SystemSetting | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setIsLoading(true)
    try {
      const response = await systemSettingApiRequest.getSystem();
      console.log(JSON.stringify(response))
      setSettings(Array.isArray(response.payload) ? response.payload : [])
      setIsLoading(false)
    } catch (error) {
      console.error("Failed to load settings:", error)
      toast.error("Failed to load settings")
      setIsLoading(false)
    }
  }


  const handleEditSetting = (setting: SystemSetting) => {
    setSelectedSetting(setting)
    setEditDialogOpen(true)
  }

  const handleEditComplete = (updatedSetting: SystemSetting) => {
    setSettings(settings.map(setting =>
      setting.id === updatedSetting.id ? updatedSetting : setting
    ))
  }


  return (
    <>
      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>System Settings</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadSettings}
              disabled={isLoading}
            >
              <RefreshCcw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
           
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">Loading settings...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Setting Code</TableHead>
                  <TableHead>Setting Key</TableHead>
                  <TableHead>Setting Value</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-4">
                      No settings found
                    </TableCell>
                  </TableRow>
                ) : (
                  settings.map((setting) => (
                    <TableRow key={setting.id}>
                      <TableCell>{setting.settingCode}</TableCell>
                      <TableCell>{setting.settingKey}</TableCell>
                      <TableCell>{setting.settingValue}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="border border-core"
                            onClick={() => handleEditSetting(setting)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {/* <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteSetting(setting)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button> */}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>


      <EditSettingDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        setting={selectedSetting}
        onEditComplete={handleEditComplete}
      />

     
    </>
  )
}
