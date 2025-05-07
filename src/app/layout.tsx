import type { Metadata } from "next";
import { IBM_Plex_Sans } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import AuthProvider from "@/providers/AuthProvider";
import userApiRequest from "@/apiRequests/user";
import { UserProfile } from "@/types/user";
import FirebaseMessagingSetup from "@/components/FirebaseMessagingSetup";

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

// Server component
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
      if (res && res.status === 200) {
        user = res.payload.data;
      }
    } catch {
      // Use console.log instead of console.error for server-side errors
      // console.log("Failed to fetch user data");
      // Don't pass the error object directly to avoid client/server boundary issues
    }
  }

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`${ibmPlexSans.className} antialiased`}>
        <AuthProvider
          initialSessionToken={sessionToken?.value}
          initialRole={role?.value}
          initialRefreshToken={refreshToken?.value}
          user={user}
        >
          <FirebaseMessagingSetup />

          {children}
          <Toaster closeButton richColors position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
