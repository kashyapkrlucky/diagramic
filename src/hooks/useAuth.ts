import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthState {
  isAuthenticated: boolean;
  guestUserId: string | null;
  isLoading: boolean;
}

const getInitialAuthState = (): AuthState => {
  const storedGuestUserId = localStorage.getItem('guestUserId');
  return {
    isAuthenticated: !!storedGuestUserId,
    guestUserId: storedGuestUserId,
    isLoading: false
  };
};

export function useAuth() {
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
    localStorage.removeItem('guestUserId');
    setAuthState({
      isAuthenticated: false,
      guestUserId: null,
      isLoading: false
    });
  };

  return {
    ...authState,
    signInAsGuest,
    signOut
  };
}
