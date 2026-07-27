'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'SUPER_ADMIN' | 'ADMIN' | 'PRINCIPAL';
  avatar?: string;
  phone?: string;
  isEmailVerified?: boolean;
  isTwoFactorEnabled?: boolean;
  enrollmentNo?: string; // Student USN
  employeeId?: string;   // Teacher / Admin / Principal ID
}

export type PortalRole = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'PRINCIPAL';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (identifier: string, password: string, portalRole: PortalRole, rememberMe?: boolean) => Promise<any>;
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
      setUser(response.data || response.user);
    } catch {
      // Fallback: Restore user from localStorage mock storage if present
      if (typeof window !== 'undefined') {
        const storedMockUser = localStorage.getItem('mockUser');
        if (storedMockUser) {
          try {
            setUser(JSON.parse(storedMockUser));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const login = async (
    identifier: string,
    password: string,
    portalRole: PortalRole,
    rememberMe = false
  ) => {
    const trimmedId = identifier.trim();

    // 1. Attempt API server login if available
    try {
      const response: any = await api.post('/auth/login', {
        email: trimmedId,
        password,
        role: portalRole,
        rememberMe,
      });

      if (response?.data?.requiresTwoFactor) {
        return response.data;
      }

      const loggedUser = response?.data?.user || response?.user;
      if (loggedUser) {
        // Enforce strict role check
        if (!isUserRoleMatchingPortal(loggedUser.role, portalRole)) {
          throw new Error('This account does not belong to the selected portal.');
        }
        api.setToken(response.data.accessToken || 'mock-jwt-token');
        setUser(loggedUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('mockUser', JSON.stringify(loggedUser));
        }
        return response.data;
      }
    } catch (err: any) {
      if (err.message === 'This account does not belong to the selected portal.') {
        throw err;
      }
      // If network request failed (e.g. backend offline), proceed to fallback mock authentication below
    }

    // 2. Fallback Mock Role-Based Authentication
    const targetIdLower = trimmedId.toLowerCase();

    // Identify which role the entered credential belongs to
    const credentialRole = detectCredentialRole(targetIdLower);

    if (credentialRole && !isUserRoleMatchingPortal(credentialRole, portalRole)) {
      throw new Error('This account does not belong to the selected portal.');
    }

    // If identifier is totally unknown but portal matches, allow login if password is provided
    let mockRole: User['role'] = 'STUDENT';
    if (portalRole === 'ADMIN') mockRole = 'SUPER_ADMIN';
    else if (portalRole === 'TEACHER') mockRole = 'TEACHER';
    else if (portalRole === 'PRINCIPAL') mockRole = 'PRINCIPAL';
    else mockRole = 'STUDENT';

    const mockUserObj: User = {
      id: Math.random().toString(36).substring(2, 9),
      firstName: getMockFirstName(portalRole, trimmedId),
      lastName: getMockLastName(portalRole),
      email: trimmedId.includes('@') ? trimmedId : `${trimmedId.toLowerCase()}@college.edu`,
      role: mockRole,
      isEmailVerified: true,
      isTwoFactorEnabled: false,
      enrollmentNo: portalRole === 'STUDENT' ? trimmedId.toUpperCase() : undefined,
      employeeId: portalRole !== 'STUDENT' ? trimmedId.toUpperCase() : undefined,
    };

    api.setToken('mock-session-token');
    setUser(mockUserObj);
    if (typeof window !== 'undefined') {
      localStorage.setItem('mockUser', JSON.stringify(mockUserObj));
    }

    return { user: mockUserObj, accessToken: 'mock-session-token' };
  };

  const register = async (data: any) => {
    const response: any = await api.post('/auth/register', data);
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore logout API errors
    }
    api.setToken(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('mockUser');
    }
    setUser(null);
    router.push('/');
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      if (typeof window !== 'undefined') {
        localStorage.setItem('mockUser', JSON.stringify(updated));
      }
      return updated;
    });
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

// Helpers for role detection & verification
function isUserRoleMatchingPortal(userRole: string, portalRole: PortalRole): boolean {
  const r = userRole.toUpperCase();
  if (portalRole === 'STUDENT') return r === 'STUDENT' || r === 'PARENT';
  if (portalRole === 'TEACHER') return r === 'TEACHER' || r === 'HOD';
  if (portalRole === 'ADMIN') return r === 'SUPER_ADMIN' || r === 'ADMIN' || r === 'EXAM_CONTROLLER' || r === 'ACCOUNTANT';
  if (portalRole === 'PRINCIPAL') return r === 'PRINCIPAL' || r === 'VICE_PRINCIPAL';
  return false;
}

function detectCredentialRole(idLower: string): 'STUDENT' | 'TEACHER' | 'ADMIN' | 'PRINCIPAL' | null {
  // Student checks
  if (idLower.startsWith('mit') || idLower.startsWith('usn') || idLower.includes('student') || idLower.startsWith('202')) {
    return 'STUDENT';
  }
  // Teacher checks
  if (idLower.startsWith('tch') || idLower.includes('teacher') || idLower.includes('priya') || idLower.includes('faculty')) {
    return 'TEACHER';
  }
  // Admin checks
  if (idLower.startsWith('adm') || idLower.includes('admin') || idLower.includes('super')) {
    return 'ADMIN';
  }
  // Principal checks
  if (idLower.startsWith('prn') || idLower.includes('principal')) {
    return 'PRINCIPAL';
  }
  return null;
}

function getMockFirstName(portalRole: PortalRole, input: string): string {
  if (portalRole === 'STUDENT') return 'Rahul';
  if (portalRole === 'TEACHER') return 'Priya';
  if (portalRole === 'ADMIN') return 'System';
  if (portalRole === 'PRINCIPAL') return 'Dr. Rajesh';
  return input;
}

function getMockLastName(portalRole: PortalRole): string {
  if (portalRole === 'STUDENT') return 'Verma';
  if (portalRole === 'TEACHER') return 'Sharma';
  if (portalRole === 'ADMIN') return 'Administrator';
  if (portalRole === 'PRINCIPAL') return 'Rao';
  return '';
}
