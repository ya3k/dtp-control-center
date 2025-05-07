"use client";
import { useCallback, useEffect } from "react";
import userApiRequest from "@/apiRequests/user";
import { useAuthContext } from "@/providers/AuthProvider";
import { sessionToken } from "@/lib/http";
import authApiRequest from "@/apiRequests/auth";
import { links } from "@/configs/routes";

declare global {
  interface Window {
    notifyAuthChange?: () => void;
  }
}
export const AUTH_SYNC_KEY = "auth_sync_timestamp";

export default function UserInitializer() {
  const { setUser } = useAuthContext();
  const fetchUserData = useCallback(async () => {
    if (!sessionToken.value) {
      setUser(null);
      return false;
    }

    try {
      const response = await userApiRequest.me();
      if (response?.payload?.success) {
        console.info("User data fetched successfully");
        setUser(response.payload.data);
        return true;
      }
    } catch (error) {
      console.info("Error fetching user data:", error);
      authApiRequest.logoutFromNextClientToNextServer(true).then(() => {
        setTimeout(() => {
          window.location.replace(`${links.login.href}?expiredToken=true`);
        }, 1000);
      });
      return false;
    }
    return false;
  }, [setUser]);

  // Setup cross-tab synchronization
  useEffect(() => {
    // Initial fetch
    fetchUserData();

    // Set up cross-tab synchronization
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === AUTH_SYNC_KEY) {
        fetchUserData();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchUserData();
      }
    };

    // When token is refreshed, fetch user data
    const handleTokenRefreshed = () => {
      fetchUserData();
    };

    window.addEventListener("storage", handleStorageChange);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("token-refreshed", handleTokenRefreshed);

    window.notifyAuthChange = () => {
      localStorage.setItem(AUTH_SYNC_KEY, Date.now().toString());
      fetchUserData();
    };

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("token-refreshed", handleTokenRefreshed);
      delete window.notifyAuthChange;
    };
  }, [fetchUserData]);
  return null;
}
