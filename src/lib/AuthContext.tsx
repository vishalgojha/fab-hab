import React, { createContext, useState, useContext, useEffect, type ReactNode } from 'react';
import { base44 } from '@/lib/base44Stub';
import { appParams } from '@/lib/app-params';

interface AuthContextType {
  user: unknown;
  isAuthenticated: boolean;
  isLoadingAuth: boolean;
  authError: { type: string; message: string } | null;
  logout: (shouldRedirect?: boolean) => void;
  navigateToLogin: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<unknown>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [authError, setAuthError] = useState<{ type: string; message: string } | null>(null);

  useEffect(() => {
    checkUserAuth();
  }, []);

  const checkUserAuth = async () => {
    try {
      if (!appParams.token) {
        setIsLoadingAuth(false);
        setIsAuthenticated(false);
        return;
      }
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      setIsLoadingAuth(false);
    } catch (error: unknown) {
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      const err = error as { status?: number; message?: string };
      if (err.status === 401 || err.status === 403) {
        setAuthError({
          type: 'auth_required',
          message: 'Authentication required',
        });
      }
    }
  };

  const logout = (shouldRedirect = true) => {
    setUser(null);
    setIsAuthenticated(false);
    if (shouldRedirect) {
      base44.auth.logout(window.location.href);
    } else {
      base44.auth.logout();
    }
  };

  const navigateToLogin = () => {
    base44.auth.redirectToLogin(window.location.href);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoadingAuth,
      authError,
      logout,
      navigateToLogin,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
