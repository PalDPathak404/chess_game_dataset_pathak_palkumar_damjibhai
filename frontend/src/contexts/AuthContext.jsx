import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:5000/api/v1';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('knightly_token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, password, rememberMe = false) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(`${API_BASE}/auth/login`, { email, password });
      const jwt = data.token;
      setToken(jwt);
      setUser(data.user ?? null);
      if (rememberMe) {
        localStorage.setItem('knightly_token', jwt);
      } else {
        sessionStorage.setItem('knightly_token', jwt);
      }
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Login failed. Please try again.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (username, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(`${API_BASE}/auth/register`, { username, email, password });
      const jwt = data.token;
      setToken(jwt);
      setUser(data.user ?? null);
      localStorage.setItem('knightly_token', jwt);
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message ?? 'Registration failed. Please try again.';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('knightly_token');
    sessionStorage.removeItem('knightly_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
