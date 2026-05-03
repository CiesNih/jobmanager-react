import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext(null);
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const s = localStorage.getItem('authUser');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) localStorage.setItem('authUser', JSON.stringify(user));
    else localStorage.removeItem('authUser');
  }, [user]);

  const login = (payload) => setUser(payload);
  const logout = () => setUser(null);
  const hasRole = (role) => {
    if (!user) return false;
    if (typeof user.role === 'string') return user.role === role;
    if (Array.isArray(user.role)) return user.role.includes(role);
    return false;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}