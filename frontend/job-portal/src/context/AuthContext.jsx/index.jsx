import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, authUtils } from '../../utils/api';
import toast from 'react-hot-toast';

// Create Auth Context
const AuthContext = createContext(null);

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { token, user: storedUser } = authUtils.getAuth();
        
        if (token && storedUser) {
          // Verify token is still valid by fetching current user
          try {
            const response = await authAPI.getMe();
            if (response.success && response.user) {
              setUser(response.user);
              setIsAuthenticated(true);
              // Update stored user data
              authUtils.setAuth(token, response.user);
            } else {
              // Token invalid, clear storage
              authUtils.clearAuth();
            }
          } catch (error) {
            // Token invalid or expired
            authUtils.clearAuth();
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        authUtils.clearAuth();
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authAPI.login(credentials);
      
      if (response.success) {
        const { token, user: userData } = response;
        authUtils.setAuth(token, userData);
        setUser(userData);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        return { success: true, user: userData };
      } else {
        toast.error(response.message || 'Login failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.register(userData);
      
      if (response.success) {
        const { token, user: newUser } = response;
        authUtils.setAuth(token, newUser);
        setUser(newUser);
        setIsAuthenticated(true);
        toast.success('Registration successful!');
        return { success: true, user: newUser };
      } else {
        toast.error(response.message || 'Registration failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authUtils.clearAuth();
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  // Update user function
  const updateUser = async (userData) => {
    try {
      setLoading(true);
      const response = await authAPI.updateProfile(userData);
      
      if (response.success) {
        const updatedUser = response.user;
        setUser(updatedUser);
        // Update stored user data
        const { token } = authUtils.getAuth();
        if (token) {
          authUtils.setAuth(token, updatedUser);
        }
        toast.success('Profile updated successfully');
        return { success: true, user: updatedUser };
      } else {
        toast.error(response.message || 'Update failed');
        return { success: false, message: response.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Update failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Refresh user data
  const refreshUser = async () => {
    try {
      const response = await authAPI.getMe();
      if (response.success && response.user) {
        setUser(response.user);
        const { token } = authUtils.getAuth();
        if (token) {
          authUtils.setAuth(token, response.user);
        }
        return response.user;
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // If token is invalid, logout
      if (error.response?.status === 401) {
        logout();
      }
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.userType === role || user?.userType === 'admin';
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    if (!user) return false;
    return roles.includes(user.userType) || user.userType === 'admin';
  };

  // Value to provide to context
  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    hasRole,
    hasAnyRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;

