import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { isSuperAdminAuthenticated, superAdminLogout, extendSuperAdminSession } from '../lib/superAdminAuth';

interface SuperAdminContextType {
  isAuthenticated: boolean;
  logout: () => void;
  checkAuth: () => boolean;
}

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(undefined);

export function SuperAdminProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    isSuperAdminAuthenticated()
  );

  const checkAuth = useCallback((): boolean => {
    const auth = isSuperAdminAuthenticated();
    setIsAuthenticated(auth);
    return auth;
  }, []);

  const logout = useCallback(async () => {
    await superAdminLogout();
    setIsAuthenticated(false);
  }, []);

  // Extend session on user activity
  useEffect(() => {
    const handleActivity = () => {
      if (isAuthenticated) {
        extendSuperAdminSession();
      }
    };

    window.addEventListener('mousemove', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('click', handleActivity);

    return () => {
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('click', handleActivity);
    };
  }, [isAuthenticated]);

  // Periodic session check every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      checkAuth();
    }, 60_000);
    return () => clearInterval(interval);
  }, [checkAuth]);

  return (
    <SuperAdminContext.Provider value={{ isAuthenticated, logout, checkAuth }}>
      {children}
    </SuperAdminContext.Provider>
  );
}

export function useSuperAdmin() {
  const context = useContext(SuperAdminContext);
  if (!context) {
    throw new Error('useSuperAdmin must be used within SuperAdminProvider');
  }
  return context;
}
