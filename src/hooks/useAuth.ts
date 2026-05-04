import { useState } from 'react';
import type { User } from '../types/index.ts';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
}

export function useAuth() {
  const navigate = useNavigate();
  
  const [authState, setAuthState] = useState<AuthState>(() => {
    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (userStr && token) {
        const userData: User = JSON.parse(userStr);
        return {
          isAuthenticated: true,
          user: userData,
          loading: false
        };
      } else {
        return {
          isAuthenticated: false,
          user: null,
          loading: false
        };
      }
    } catch {
      return {
        isAuthenticated: false,
        user: null,
        loading: false
      };
    }
  });

  const checkAuthStatus = () => {
    try {
      const userStr = localStorage.getItem('user');
      const token = localStorage.getItem('token');
      
      if (userStr && token) {
        const userData: User = JSON.parse(userStr);
        setAuthState({
          isAuthenticated: true,
          user: userData,
          loading: false
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false
        });
      }
    } catch {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false
      });
    }
  };

  const signOut = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false
    });
    navigate('/');
  };

  const login = (userData: User, token: string) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
    setAuthState({
      isAuthenticated: true,
      user: userData,
      loading: false
    });
  };

  
  return {
    ...authState,
    signOut,
    login,
    checkAuthStatus,
  };
}
