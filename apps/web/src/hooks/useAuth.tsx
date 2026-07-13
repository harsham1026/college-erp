'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  avatar?: string;
  phone?: string;
  isEmailVerified: boolean;
  isTwoFactorEnabled: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<any>;
  register: (data: any) => Promise<any>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchProfile = useCallback(async () => {
    try {
      const token = api.getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }
      const response: any = await api.get('/auth/profile');
      setUser(response.data);
    } catch {
      api.setToken(null);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = async (email: string, password: string, rememberMe = false) => {
    const response: any = await api.post('/auth/login', { email, password, rememberMe });
    if (response.data.requiresTwoFactor) {
      return response.data;
    }
    api.setToken(response.data.accessToken);
    setUser(response.data.user);
    return response.data;
  };

  const register = async (data: any) => {
    const response: any = await api.post('/auth/register', data);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore logout errors
    }
    api.setToken(null);
    setUser(null);
    router.push('/login');
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
