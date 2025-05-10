"use client";

import { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedBackType } from "@/schemaValidations/feedback.schema";
import tourApiService from "@/apiRequests/tour";
import { format } from "date-fns";
import { Loader2, RefreshCw } from "lucide-react";
import { ColumnDef, ColumnToggleDropdown } from "@/components/common/table/column-toggle-dropdown";
import { Button } from "@/components/ui/button";

export default function FeedbackPage() {
    const [feedbacks, setFeedbacks] = useState<FeedBackType[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFeedbacks = async () => {
        setLoading(true);
        try {
            const response = await tourApiService.getFeedBack();
            setFeedbacks(response.payload.data);
        } catch (error) {
            console.error("Error fetching feedbacks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    // Define column configuration
    const columns: ColumnDef<FeedBackType>[] = [
        {
            id: "id",
            header: "ID",
            accessorKey: "id",
            cell: (feedback) => feedback.id,
            enableHiding: true,
            defaultHidden: true,
        },
        {
            id: "userName",
            header: "Tên người dùng",
            accessorKey: "userName",
            cell: (feedback) => feedback.userName,
            enableHiding: false,
        },
        {
            id: "tourTitle",
            header: "Tiêu đề tour",
            accessorKey: "tourTitle",
            cell: (feedback) => feedback.tourTitle,
            enableHiding: false,
        },
        {
            id: "description",
            header: "Góp ý",
            accessorKey: "description",
            cell: (feedback) => (
                <div
                    className="max-w-md whitespace-normal break-words"
                    title={feedback.description}
                >
                    {feedback.description}
                </div>
            ),
            enableHiding: false,
        }
        ,
        {
            id: "openDate",
            header: "Ngày mở tour",
            accessorKey: "openDate",
            cell: (feedback) => format(new Date(feedback.openDate), "dd/MM/yyyy"),
            enableHiding: true,
            align: "center",
        },
    ];

    // Track visible columns
    const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
        columns.reduce((acc, column) => ({
            ...acc,
            [column.id]: column.defaultHidden === true ? false : true,
        }), {})
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (feedbacks.length === 0) {
        return (
            <div className="text-center p-8">
                <h3 className="text-lg font-medium">Không tìm thấy phản hồi nào</h3>
                <p className="text-sm text-muted-foreground mt-2">
                    Hiện tại không có phản hồi nào.
                </p>
                <Button
                    variant="outline"
                    onClick={fetchFeedbacks}
                    className="mt-4"
                >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Tải lại
                </Button>
            </div>
        );
    }

    // Get filtered columns that should be visible
    const visibleColumnDefs = columns.filter(column => visibleColumns[column.id]);

    return (
        <div className="container mx-auto py-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between text-3xl">
                    <CardTitle>Phản hồi tour</CardTitle>
                    <Button
                        variant="outline"
                        onClick={fetchFeedbacks}
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Tải lại
                    </Button>
                </CardHeader>
                <CardContent>
                    {/* Column visibility dropdown */}
                    <div className="flex justify-end my-2 px-4">
                        <ColumnToggleDropdown
                            columns={columns}
                            visibleColumns={visibleColumns}
                            setVisibleColumns={setVisibleColumns}
                        />
                    </div>

                    {/* Table */}
                    <div className="relative w-full overflow-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {visibleColumnDefs.map((column) => (
                                        <TableHead
                                            key={column.id}
                                            className={`text-gray-800 font-bold text-sm
                        ${column.className ||
                                                (column.align === "right" ? "text-right" :
                                                    (column.align === "center" ? "text-center" : undefined))}                   
                        `
                                            }
                                        >
                                            {column.header}
                                        </TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {feedbacks.map((feedback) => (
                                    <TableRow key={feedback.id}>
                                        {visibleColumnDefs.map((column) => (
                                            <TableCell
                                                key={`${feedback.id}-${column.id}`}
                                                className={
                                                    column.align === "right" ? "text-right" :
                                                        (column.align === "center" ? "text-center" : undefined)
                                                }
                                            >
                                                {column.cell(feedback)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
