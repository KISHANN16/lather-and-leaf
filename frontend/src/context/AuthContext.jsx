import React, { createContext, useState, useEffect, useContext } from 'react';
import { API_URL } from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('ll_user');
    const storedToken = localStorage.getItem('ll_token');
    
    const verifyToken = async (u, t) => {
      try {
        const response = await fetch(`${API_URL}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${t}`,
          },
        });
        if (response.ok) {
          setUser(u);
          setToken(t);
        } else if (response.status === 401) {
          console.warn('Stale session token detected, logging out.');
          setUser(null);
          setToken(null);
          localStorage.removeItem('ll_user');
          localStorage.removeItem('ll_token');
        } else {
          setUser(u);
          setToken(t);
        }
      } catch (err) {
        console.error('Error verifying token:', err);
        setUser(u);
        setToken(t);
      } finally {
        setLoading(false);
      }
    };

    if (storedUser && storedToken) {
      verifyToken(JSON.parse(storedUser), storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      setUser(data);
      setToken(data.token);
      localStorage.setItem('ll_user', JSON.stringify(data));
      localStorage.setItem('ll_token', data.token);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setUser(data);
      setToken(data.token);
      localStorage.setItem('ll_user', JSON.stringify(data));
      localStorage.setItem('ll_token', data.token);
      return data;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ll_user');
    localStorage.removeItem('ll_token');
  };

  const updateAddress = async (address) => {
    try {
      if (!token) throw new Error('Not authenticated');

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ address }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update address');
      }

      // Update local states
      const updatedUser = { ...user, address: data.address };
      setUser(updatedUser);
      localStorage.setItem('ll_user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateAddress }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
