"use client";
import { useCallback, useEffect } from "react";
import { differenceInMinutes } from "date-fns";

import authApiRequest from "@/apiRequests/auth";
import { links } from "@/configs/routes";
import { refreshToken, sessionToken } from "@/lib/http";
import { decodeJwtTokenOnBrowser } from "@/lib/utils";

export default function TrackingToken() {
  const accessToken = sessionToken.value;
  
  const getTokenExpiration = useCallback((): Date | null => {
    if (!accessToken) return null;
    const decoded = decodeJwtTokenOnBrowser(accessToken);
    if (!decoded || !decoded.exp) return null;
    return new Date(decoded.exp * 1000);
  }, [accessToken]);

  const handleInvalidToken = useCallback(() => {
    authApiRequest.logoutFromNextClientToNextServer(true).then(() => {
      setTimeout(() => {
        window.location.replace(
          `${links.login.href}?expiredToken=true`,
        );
      }, 1000);
    });
  }, []);

  const refreshUserToken = useCallback(async () => {
    try {
      const response = await authApiRequest.refreshFromNextClientToNextServer();

      if (response?.payload?.data) {
        console.log("Token refreshed successfully");
        sessionToken.value = response.payload.data.accessToken;
        refreshToken.value = response.payload.data.refreshToken;

        window.dispatchEvent(new CustomEvent("token-refreshed"));

        return true;
      } else {
        console.error("Failed to refresh token");
        handleInvalidToken();
        return false;
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
      handleInvalidToken();
      return false;
    }
  }, [handleInvalidToken]);
  useEffect(() => {
    if (!accessToken) return;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const setupTokenRefresh = async() => {
      const expirationTime = getTokenExpiration();
      if (!expirationTime) return null;

      const now = new Date();
      const minutesUntilExpiry = differenceInMinutes(expirationTime, now);

      // If token is already expired or will expire within 10 minutes
      if (minutesUntilExpiry <= 10) {
        // Try to refresh immediately
        const success = await refreshUserToken();
        if(success) {
          setupTokenRefresh();
        }
      }

      // Set timeout to refresh token 10 minutes before expiration
      const refreshTime = minutesUntilExpiry - 10;
      const refreshDelay = refreshTime * 60 * 1000;
      console.log(`Token will refresh in ${refreshTime} minutes`);

      timeoutId = setTimeout(
        async () => {
          const success = await refreshUserToken();
          if (success) {
            // Set up the next refresh
            setupTokenRefresh();
          }
        },
        refreshDelay,
      );
    };

    // Set up first token refresh
    setupTokenRefresh();

    // Clean up on unmount
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [getTokenExpiration, refreshUserToken, accessToken]);

  return null;
}
