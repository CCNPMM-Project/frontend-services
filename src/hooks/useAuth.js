import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyToken } from '../services/authService';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [loginAttempted, setLoginAttempted] = useState(false);
  const navigate = useNavigate();

  const checkTokenValidity = useCallback(async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      handleAuthFailure();
      setLoginAttempted(true);
      return false;
    }

    try {
      const response = await verifyToken();

      if (response.data && response.data.status === 200) {
        const userData = localStorage.getItem('user');
        if (userData) {
          try {
            setUser(JSON.parse(userData));
          } catch (e) {
            console.error('Failed to parse user data', e);
          }
        }
        setIsAuthenticated(true);
        setLoginAttempted(true);
        return true;
      } else {
        handleAuthFailure();
        setLoginAttempted(true);
        return false;
      }
    } catch (error) {
      console.error('Error verifying token:', error);
      handleAuthFailure();
      setLoginAttempted(true);
      return false;
    }
  }, []);

  const handleAuthFailure = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('email');
    localStorage.removeItem('userId');
    setUser(null);
    setIsAuthenticated(false);
  };

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      // optional: call API để revoke token nếu backend có
      // await revokeToken();
    } catch (error) {
      console.error('Failed to revoke token:', error);
    } finally {
      handleAuthFailure();
      setIsLoading(false);
      setLoginAttempted(true);
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const checkAuthentication = async () => {
      setIsLoading(true);
      try {
        await checkTokenValidity();
      } catch (error) {
        console.error('Authentication check failed:', error);
        handleAuthFailure();
      } finally {
        setIsLoading(false);
        setLoginAttempted(true);
      }
    };
    
    checkAuthentication();
  }, [checkTokenValidity]);

  return {
    isAuthenticated,
    isLoading,
    loginAttempted,
    user,
    logout,
  };
};

export default useAuth;
