import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  guestUserId: string | null;
  isLoading: boolean;
}

const getInitialAuthState = (): AuthState => {
  const storedGuestUserId = localStorage.getItem('guestUserId');
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  return {
    isAuthenticated: !!(storedGuestUserId || (user && token)),
    guestUserId: storedGuestUserId,
    isLoading: false
  };
};

const getInitialUser = (): User | null => {
  const storedUser = localStorage.getItem('user');
  return storedUser ? JSON.parse(storedUser) : null;
};

const getInitialToken = (): string | null => {
  return localStorage.getItem('token');
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(getInitialUser);
  const [token, setToken] = useState<string | null>(getInitialToken);
  const [authState, setAuthState] = useState<AuthState>(getInitialAuthState);
  const navigate = useNavigate();

  const generateGuestUserId = (): string => {
    return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  
  const signInAsGuest = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const guestUserId = generateGuestUserId();
    localStorage.setItem('guestUserId', guestUserId);
    
    setAuthState({
      isAuthenticated: true,
      guestUserId,
      isLoading: false
    });
    
    navigate('/');
  };

  const signOut = () => {
    localStorage.clear();
    setUser(null);
    setToken(null);
    setAuthState({
      isAuthenticated: false,
      guestUserId: null,
      isLoading: false
    });
  };

  return {
    user,
    token,
    ...authState,
    signInAsGuest,
    signOut
  };
}
