// destination-data-table.tsx
"use client";

import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    VisibilityState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ChevronDown } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TableState {
    pageIndex: number;
    pageSize: number;
    globalFilter: string;
    isDeletedFilter: string;
    sorting: { id: string; desc: boolean }[];
    columnVisibility: VisibilityState; // Thêm columnVisibility vào TableState
}

interface DataTableProps<TData> {
    columns: ColumnDef<TData>[];
    data: TData[];
    tableState: TableState;
    setTableState: (state: TableState) => void;
}

export default function OperatorToursDataTable<TData>({ columns, data, tableState, setTableState }: DataTableProps<TData>) {
    const { pageIndex, pageSize, globalFilter, isDeletedFilter, sorting, columnVisibility } = tableState;

    const table = useReactTable({
        data,
        columns,
        state: {
            pagination: { pageIndex, pageSize },
            globalFilter,
            sorting,
            columnVisibility,
        },
        onPaginationChange: (updater) => {
            const newPagination = typeof updater === "function" ? updater({ pageIndex, pageSize }) : updater;
            setTableState({ ...tableState, pageIndex: newPagination.pageIndex, pageSize: newPagination.pageSize });
        },
        onGlobalFilterChange: (value) => setTableState({ ...tableState, globalFilter: value || "", pageIndex: 0 }),
        onSortingChange: (updater) => {
            const newSorting = typeof updater === "function" ? updater(sorting) : updater;
            setTableState({ ...tableState, sorting: newSorting });
        },
        onColumnVisibilityChange: (updater) => {
            const newVisibility = typeof updater === "function" ? updater(columnVisibility) : updater;
            setTableState({ ...tableState, columnVisibility: newVisibility });
        },
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
    });

    const handleIsDeletedFilterChange = (value: string) => {
        setTableState({ ...tableState, isDeletedFilter: value, pageIndex: 0 });
    };

    return (
        <div className="w-full">
            <div className="flex flex-wrap items-center gap-4 py-4">
                <Input
                    placeholder="Filter name, createdBy, etc..."
                    value={globalFilter}
                    onChange={(event) => table.setGlobalFilter(event.target.value)}
                    className="max-w-sm"
                />
                {/* <div className="flex items-center gap-2">
          <span>Status: </span>
          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={isDeletedFilter}
            onChange={(e) => handleIsDeletedFilterChange(e.target.value)}
          >
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="deleted">Deleted</option>
          </select>
        </div> */}
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => (
                                <DropdownMenuCheckboxItem
                                    key={column.id}
                                    className="capitalize"
                                    checked={column.getIsVisible()}
                                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                                >
                                    {column.columnDef.header instanceof Function
                                        ? column.id
                                        : column.columnDef.header?.toString() || column.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : header.column.columnDef.header instanceof Function
                                                ? header.column.columnDef.header(header.getContext())
                                                : header.column.columnDef.header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {typeof cell.column.columnDef.cell === "function"
                                                ? cell.column.columnDef.cell(cell.getContext())
                                                : null}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={data.length < pageSize}
                >
                    Next
                </Button>
            </div>
        </div>
    );
}