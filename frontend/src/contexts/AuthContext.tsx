'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import { toast } from 'sonner';

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

interface ProfileResponse {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export type UserRole = 'USER' | 'VIEWER';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUser();
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get<ProfileResponse>('/users/profile');
      setUser({
        id: response.data.id,
        email: response.data.email,
        role: response.data.role
      });
      setError(null);
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.post<AuthResponse>('/auth/login', { 
        email, 
        password 
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const { token, user: userData } = response.data.data;
      localStorage.setItem('token', token);
      setUser(userData);
      toast.success(response.data.message);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || error.message || 'Failed to login';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Sending registration request:', { email, role });
      const response = await axios.post<AuthResponse>('/auth/register', { 
        email, 
        password,
        role
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const { token, user: userData } = response.data.data;
      localStorage.setItem('token', token);
      setUser(userData);
      toast.success(response.data.message);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Registration error:', error);
      const message = error.response?.data?.message || error.message || 'Failed to register';
      setError(message);
      toast.error(message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/auth/login');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, register, logout }}>
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