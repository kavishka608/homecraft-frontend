import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  // Return safe fallback so pages don't crash if no provider
  return ctx || {
    user: {
      role: localStorage.getItem('role'),
      fullName: localStorage.getItem('fullName'),
      email: localStorage.getItem('email'),
      id: localStorage.getItem('userId'),
    },
    isAuthenticated: !!localStorage.getItem('token'),
    isClient: localStorage.getItem('role') === 'CLIENT',
    isProfessional: localStorage.getItem('role') === 'PROFESSIONAL',
    isAdmin: localStorage.getItem('role') === 'ADMIN',
    logout: () => {
      localStorage.clear();
      window.location.href = '/login';
    },
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setUser({
        id: localStorage.getItem('userId'),
        role: localStorage.getItem('role'),
        fullName: localStorage.getItem('fullName'),
        email: localStorage.getItem('email'),
      });
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    localStorage.setItem('token', authToken);
    localStorage.setItem('role', userData.role);
    localStorage.setItem('userId', userData.userId);
    localStorage.setItem('fullName', userData.fullName);
    localStorage.setItem('email', userData.email);
    setToken(authToken);
    setUser(userData);
  };

  const logout = () => {
    localStorage.clear();
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!token,
    isClient: user?.role === 'CLIENT' || user?.role === 'HOMEOWNER',
    isProfessional: user?.role === 'PROFESSIONAL',
    isAdmin: user?.role === 'ADMIN',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;