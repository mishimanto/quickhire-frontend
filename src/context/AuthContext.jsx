'use client';
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '@/lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]         = useState(null);
  const [loading, setLoading]   = useState(true); // starts TRUE — blocks redirect until hydrated

  useEffect(() => {
  const token = localStorage.getItem('qh_token');
  const saved = localStorage.getItem('qh_user');

  if (token && saved) {
    try {
      const parsedUser = JSON.parse(saved);
      setUser(parsedUser);
    } catch (e) {
      console.error("Auth parse error", e);
      localStorage.removeItem('qh_token');
      localStorage.removeItem('qh_user');
    }
  }

  setTimeout(() => {
    setLoading(false);
  }, 50); // small delay ensures hydration
}, []);

  const login = useCallback(async (email, password) => {
    const res = await authApi.login({ email, password });
    const { token, user } = res.data.data;
    localStorage.setItem('qh_token', token);
    localStorage.setItem('qh_user', JSON.stringify(user));
    setUser(user);
    return user;
  }, []);

  const register = useCallback(async (name, email, password, password_confirmation) => {
    const res = await authApi.register({ name, email, password, password_confirmation });
    const { token, user } = res.data.data;
    localStorage.setItem('qh_token', token);
    localStorage.setItem('qh_user', JSON.stringify(user));
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(async () => {
  const token = localStorage.getItem('qh_token');

  if (token) {
    try {
      await authApi.logout();
    } catch {}
  }

  localStorage.removeItem('qh_token');
  localStorage.removeItem('qh_user');

  setUser(null);
}, []);

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAdmin: user?.role === 'admin',
      isAuth:  !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};