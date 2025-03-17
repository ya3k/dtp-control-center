import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { CompanyResType } from "@/schemaValidations/company.schema";
import { TableEmptyState } from "../common-table/table-empty-state";

interface OperatorTableProps {
  companies: CompanyResType[];
  loading: boolean;
  resetFilters: () => void;
  onEditCompany?: (company: CompanyResType) => void;
}

export function CompanyTable({ companies, loading, resetFilters, onEditCompany }: OperatorTableProps) {
  return (
    <Table>
      <TableCaption>Showing {companies.length} companies</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Phone</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Tax Code</TableHead>
          <TableHead>Licensed</TableHead>
          <TableHead>Staff</TableHead>
          <TableHead>Tour Count</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          <TableRow>
            <TableCell colSpan={8} className="text-center">Loading...</TableCell>
          </TableRow>
        ) : companies.length > 0 ? (
          companies.map((company) => (
            <TableRow key={company.id}>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.phone}</TableCell>
              <TableCell>{company.email}</TableCell>
              <TableCell>{company.taxCode}</TableCell>
              <TableCell>
                <Badge variant={company.lisenced ? "active" : "destructive"}>
                  {company.lisenced ? "Yes" : "No"}
                </Badge>
              </TableCell>
              <TableCell>{company.staff}</TableCell>
              <TableCell>{company.tourCount}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm" onClick={() => onEditCompany && onEditCompany(company)}>
                  <Pencil className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableEmptyState mess="Không tìm thấy công ty" resetFilters={resetFilters} />
        )}
      </TableBody>
    </Table>
  );
}
