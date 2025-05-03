'use client';

import { useEffect } from 'react';
import useNotifications from '@/hooks/useNotifications';

interface TokenManagerProps {
  onTokenReady?: (token: string | null) => void;
}

/**
 * Component that manages FCM token retrieval
 * This component doesn't render anything, it just manages token state
 */
const TokenManager: React.FC<TokenManagerProps> = ({ onTokenReady }) => {
  // Use our notification hook and pass the callback
  const { token } = useNotifications((newToken) => {
    // Whenever token changes, call the onTokenReady callback
    if (onTokenReady) {
      onTokenReady(newToken);
    }
  });

  // Also call onTokenReady when the component mounts
  useEffect(() => {
    if (token && onTokenReady) {
      onTokenReady(token);
    }
  }, [token, onTokenReady]);

  // This component doesn't render anything
  return null;
};

export default TokenManager; 