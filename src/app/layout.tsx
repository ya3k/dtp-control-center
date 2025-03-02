import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import "./globals.css";
import LoadingBar from "@/components/common/LoadingBar";
import PageLoader from "@/providers/LoaderProvider";
import { Toaster } from "@/components/ui/sonner";

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
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${ibmPlexSans.className} antialiased`}>
        <LoadingBar />
        <PageLoader />
        {children}
        <Toaster closeButton/>
        </body>
    </html>
  );
}
