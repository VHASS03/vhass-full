import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export const useAuthCheck = () => {
  const location = useLocation();
  const { checkAuthStatus, user } = useAuth();

  useEffect(() => {
    // Check auth status on route changes
    checkAuthStatus();
  }, [location.pathname, checkAuthStatus]);

  return { user };
};
