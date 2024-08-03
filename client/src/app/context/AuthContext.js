'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import Cookies from 'js-cookie';

import { fetchUser } from '../api/fetchUser';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = await fetchUser();
      setUser(user);
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signIn = (userData) => {
    setUser(userData);
  };

  const signOut = () => {
    Cookies.remove('Authorization', { path: '/' });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
