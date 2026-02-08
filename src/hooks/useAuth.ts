import { useState, useEffect, useCallback } from 'react';

// Simple hash function for client-side password verification
// Note: For production, use a proper backend authentication
const hashPassword = (password: string): string => {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
};

// Pre-computed hash of "146161"
const ADMIN_PASSWORD_HASH = hashPassword('146161');

const AUTH_KEY = 'boya-stok-admin-auth';
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

interface AuthState {
  isAuthenticated: boolean;
  lastActivity: number;
}

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    const checkSession = () => {
      try {
        const stored = sessionStorage.getItem(AUTH_KEY);
        if (stored) {
          const authState: AuthState = JSON.parse(stored);
          const now = Date.now();

          // Check if session has expired
          if (now - authState.lastActivity < SESSION_TIMEOUT) {
            setIsAuthenticated(true);
            // Update last activity
            sessionStorage.setItem(AUTH_KEY, JSON.stringify({
              ...authState,
              lastActivity: now
            }));
          } else {
            // Session expired
            sessionStorage.removeItem(AUTH_KEY);
            setIsAuthenticated(false);
          }
        }
      } catch {
        sessionStorage.removeItem(AUTH_KEY);
      }
      setIsLoading(false);
    };

    checkSession();
  }, []);

  // Update activity on user interaction
  const updateActivity = useCallback(() => {
    if (isAuthenticated) {
      const authState: AuthState = {
        isAuthenticated: true,
        lastActivity: Date.now()
      };
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(authState));
    }
  }, [isAuthenticated]);

  const login = useCallback((password: string): boolean => {
    const inputHash = hashPassword(password);

    if (inputHash === ADMIN_PASSWORD_HASH) {
      const authState: AuthState = {
        isAuthenticated: true,
        lastActivity: Date.now()
      };
      sessionStorage.setItem(AUTH_KEY, JSON.stringify(authState));
      setIsAuthenticated(true);
      return true;
    }

    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(AUTH_KEY);
    setIsAuthenticated(false);
  }, []);

  return {
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateActivity
  };
}
