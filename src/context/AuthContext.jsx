import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const TOKEN_KEY = 'finance_token';
const USER_KEY = 'finance_user';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const saved = localStorage.getItem(USER_KEY);
    if (token && saved) {
      try {
        setUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    localStorage.setItem(TOKEN_KEY, data.token);
    const u = { userId: data.userId, email: data.email };
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  };

  const getToken = () => localStorage.getItem(TOKEN_KEY);

  // ------------------------
  // Delete Account Function
  // ------------------------
  const deleteAccount = async () => {
    if (!user) throw new Error('No user logged in');

    try {
      // OPTIONAL: call backend API to delete user permanently
      // await fetch(`/api/users/${user.userId}`, { method: 'DELETE', headers: { Authorization: `Bearer ${getToken()}` } });

      // Remove user locally
      logout();
    } catch (error) {
      console.error('Failed to delete account:', error);
      throw error; // allow the UI to handle the error
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, getToken, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
