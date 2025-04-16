import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/providers/AuthProvider";
import TrackingToken from "@/components/common/TrackingToken";
import userApiRequest from "@/apiRequests/user";
import { UserProfile } from "@/types/user";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get("_auth");
  const role = cookieStore.get("role");
  const refreshToken = cookieStore.get("cont_auth");

  let user: UserProfile | null = null;

  if (sessionToken) {
    try {
      const res = await userApiRequest.me(sessionToken.value);
      if (res.status === 200) {
        user = res.payload.data;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
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
          user={user}
        >
          {/* <TrackingToken /> */}
          {children}
          <Toaster closeButton richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
