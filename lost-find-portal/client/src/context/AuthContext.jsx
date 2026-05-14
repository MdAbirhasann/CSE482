import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/api.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('lostFindUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('lostFindToken'));
  const [loading, setLoading] = useState(Boolean(localStorage.getItem('lostFindToken')));

  const saveAuth = (authData) => {
    localStorage.setItem('lostFindToken', authData.token);
    localStorage.setItem('lostFindUser', JSON.stringify(authData.user));
    setToken(authData.token);
    setUser(authData.user);
  };

  const login = async (formData) => {
    const { data } = await api.post('/auth/login', formData);
    saveAuth(data);
    return data.user;
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    saveAuth(data);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('lostFindToken');
    localStorage.removeItem('lostFindUser');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get('/auth/me');
        localStorage.setItem('lostFindUser', JSON.stringify(data.user));
        setUser(data.user);
      } catch (_error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const value = useMemo(
    () => ({ user, token, loading, isAuthenticated: Boolean(user && token), login, register, logout }),
    [user, token, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
