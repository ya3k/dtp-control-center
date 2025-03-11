import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";

import "./globals.css";
import LoadingBar from "@/components/common/loading/LoadingBar";
import PageLoader from "@/providers/LoaderProvider";
import { Toaster } from "@/components/ui/sonner";
import LoadingScreen from "@/components/common/loading/LoadingScreen";
import AuthProvider from "@/providers/AuthProvider";
import { cookies } from "next/headers";

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
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${ibmPlexSans.className} antialiased`}>
          <AuthProvider initialSessionToken={sessionToken?.value} initialRole={role?.value}>
            <LoadingScreen>
              <LoadingBar />
              <PageLoader />
              {children}
              <Toaster closeButton richColors/>
            </LoadingScreen>
          </AuthProvider>
      </body>
    </html>
  );
}
