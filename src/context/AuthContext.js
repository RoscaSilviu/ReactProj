import React, { createContext, useState, useContext ,useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('authToken'));
  
  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(
        !!localStorage.getItem('authToken') || 
        !!sessionStorage.getItem('authToken')
      );
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );  
};

export const useAuth = () => useContext(AuthContext);
