import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import type { User } from '../types';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string
}

const getInitialAuthState = (): AuthState => {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  
  return {
    isAuthenticated: !!(user && token),
    user: user ? JSON.parse(user) : null,
    token: token || ''
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(getInitialAuthState().isAuthenticated);

  const signOut = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    setIsAuthenticated(false);
  };

  return {
    user,
    token,
    isAuthenticated,
    signOut
  };
}
