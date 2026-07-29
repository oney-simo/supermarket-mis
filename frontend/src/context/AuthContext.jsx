import React, { createContext, useState, useEffect } from 'react';
import { loginUser } from '../api/authApi';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage on app load
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    const data = await loginUser(username, password);
    const authToken = data.token;
    const userData = data.user || {
      _id: data._id,
      username: data.username,
      role: data.role,
      fullName: data.fullName
    };

    setToken(authToken);
    setUser(userData);

    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(userData));

    return userData;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role: user?.role,
        isAuthenticated: !!token,
        loading,
        login,
        logout
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
}