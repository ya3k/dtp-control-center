"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function NotFound() {
    const router = useRouter();
    const [count, setCount] = useState(5);

    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/");
        }, 5000);

        // Create countdown effect
        const interval = setInterval(() => {
            if (count == 0) {
                return;
            }
            setCount((prev) => prev - 1);
        }, 1000);

        // Cleanup on unmount
        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [router]);

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
            <div className="flex flex-col items-center justify-center space-y-6 text-center">
                <div className="text-9xl font-bold text-core">404</div>
                <h1 className="text-3xl font-bold">Không tìm thấy trang</h1>
                <p className="max-w-md text-muted-foreground">
                    Trang bạn đang tìm kiếm có thể đã bị xóa hoặc không tồn tại.
                    Bạn sẽ được chuyển hướng về trang chủ sau {count} giây.
                </p>
                <div className="flex gap-4">
                    <Link href="/">
                        <Button variant="core" className="rounded-full px-6">
                            Về trang chủ ngay
                        </Button>
                    </Link>
                    <Button
                        variant="outline"
                        className="rounded-full px-6"
                        onClick={() => router.back()}
                    >
                        Quay lại
                    </Button>
                </div>
            </div>
        </div>
    );
}