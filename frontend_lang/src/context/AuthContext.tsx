import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types/user';
import { loginUser, registerUser, getCurrentUserProfile } from '../api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem('user');
    return cached ? JSON.parse(cached) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (!localStorage.getItem('token')) {
      setUser(null);
      return;
    }
    try {
      const profile = await getCurrentUserProfile();
      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
    } catch {
      logout();
    }
  };

  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);

    if (token) {
      refreshUser().finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }

    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const login = async (email: string, pass: string) => {
    const response = await loginUser(email, pass);
    localStorage.setItem('token', response.token);
    setToken(response.token);
    const initialUser: User = {
      id: response.userId,
      email: response.email,
      subscriptionStatus: response.subscriptionStatus,
      role: response.role,
    };
    setUser(initialUser);
    localStorage.setItem('user', JSON.stringify(initialUser));
    await refreshUser();
  };

  const register = async (email: string, pass: string) => {
    const response = await registerUser(email, pass);
    localStorage.setItem('token', response.token);
    setToken(response.token);
    const initialUser: User = {
      id: response.userId,
      email: response.email,
      subscriptionStatus: response.subscriptionStatus,
      role: response.role,
    };
    setUser(initialUser);
    localStorage.setItem('user', JSON.stringify(initialUser));
    await refreshUser();
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, refreshUser }}>
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
