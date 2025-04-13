import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/providers/AuthProvider";
import { ReactScan } from "@/components/common/ReactScanComponent";
const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["vietnamese"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Binh Dinh Tour",
  description: "Powered by BinhDinhTour",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("sessionToken");
  const role = cookieStore.get("role");
  const refreshToken = cookieStore.get("refreshToken");
  return (
    <html lang="en">
      <head>
        {/* <script src="https://unpkg.com/react-scan/dist/auto.global.js" /> */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

      </head>
      {/* <ReactScan /> */}
      <body className={`${ibmPlexSans.className} antialiased`}>
        <AuthProvider
          initialSessionToken={sessionToken?.value}
          initialRole={role?.value}
          initialRefreshToken={refreshToken?.value}
        >
          {children}
          <Toaster closeButton richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
