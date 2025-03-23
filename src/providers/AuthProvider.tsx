"use client";
import { refreshToken, sessionToken, userRole } from "@/lib/http";
import { useState } from "react";

// const AuthContext = createContext({
//   sessionToken: "",
//   setSessionToken: (token: string) => {},
//   role: "",
//   setRole: (role: string) => {},
// });

// export const useAuthContext = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuthContext must be used within an AuthProvider");
//   }
//   return context;
// };

export default function AuthProvider({
  children,
  initialSessionToken = "",
  initialRole = "",
  initialRefreshToken = "",
}: {
  children: React.ReactNode;
  initialSessionToken?: string;
  initialRole?: string;
  initialRefreshToken?: string;
}) {
  // const [sessionToken, setSessionToken] = useState(initialSessionToken);
  // const [role, setRole] = useState(initialRole);
  useState(() => {
    if (typeof window !== "undefined") {
      sessionToken.value = initialSessionToken;
      userRole.value = initialRole;
      refreshToken.value = initialRefreshToken;
    }
  });

  return (
    // <AuthContext.Provider
    //   value={{ sessionToken, setSessionToken, role, setRole }}
    // >
    <>{children}</>
    // </AuthContext.Provider>
  );
}
