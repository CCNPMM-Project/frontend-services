import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { verifyToken, getProfile } from '../services/authService';

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
      const verifyResponse = await verifyToken();
      if (verifyResponse.data && verifyResponse.data.status === 200) {
        const profileResponse = await getProfile();
        if (profileResponse.data && profileResponse.data.data) {
          setUser(profileResponse.data.data);
          localStorage.setItem('user', JSON.stringify(profileResponse.data.data));
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
