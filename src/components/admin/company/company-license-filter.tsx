"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CompanyLicenseProps {
    licenseFilter: string;
    setLicenseFilter: (value: string) => void;

}

export function CompanyLicenseFilter({ licenseFilter, setLicenseFilter }: CompanyLicenseProps) {
    return (
        <div className="space-y-2">
            <Label>Trạng thái cấp phép</Label>
            <Select
                value={licenseFilter.toString()}
                onValueChange={(value) => setLicenseFilter(String(value))}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Tất cả" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="true">Được cấp phép</SelectItem>
                    <SelectItem value="false">Chưa được cấp phép</SelectItem>
                   
                </SelectContent>
            </Select>
        </div>
    )
}
