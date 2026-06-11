import React, { createContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Add token state
  const [refresh, setRefresh] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    const savedRefresh = localStorage.getItem('refresh');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedToken) {
      setToken(savedToken);
    }
    if (savedRefresh) {
      setRefresh(savedRefresh);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = useCallback((data, email) => {
    const token = data.bearerToken.token;
    const refresh = data.refreshToken.token;
    setUser({ token, email });
    setToken(token);
    setRefresh(refresh);
    localStorage.setItem("token", token);
    localStorage.setItem("refresh", refresh);
    localStorage.setItem('user', JSON.stringify({ token, email }));
  }, []);

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setRefresh(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
  };

  return (
    <AuthContext.Provider value={{ user, token, handleLogin, handleLogout, isLoading, refresh }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
