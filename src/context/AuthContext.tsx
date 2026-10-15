import React, { createContext, useContext, useEffect, useState } from 'react';
import { PRECONFIGURED_USER } from '../data/mockUser';
import { User } from '../types';
import { LoginFormErrors, validateLoginForm } from '../utils/validation';
import { loadJson, removeKey, saveJson } from '../utils/storage';

interface LoginResult {
  success: boolean;
  errors?: LoginFormErrors;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => LoginResult;
  logout: () => void;
}

export const SESSION_STORAGE_KEY = 'pixelcart_session_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => loadJson<User | null>(SESSION_STORAGE_KEY, null));

  useEffect(() => {
    if (user) {
      saveJson(SESSION_STORAGE_KEY, user);
    } else {
      removeKey(SESSION_STORAGE_KEY);
    }
  }, [user]);

  const login = (email: string, password: string): LoginResult => {
    const fieldErrors = validateLoginForm(email, password);
    if (Object.keys(fieldErrors).length > 0) {
      return { success: false, errors: fieldErrors };
    }

    if (email.trim().toLowerCase() !== PRECONFIGURED_USER.email.toLowerCase()) {
      return { success: false, errors: { general: 'No account found with this email' } };
    }

    if (password !== PRECONFIGURED_USER.password) {
      return { success: false, errors: { general: 'Incorrect password' } };
    }

    setUser({
      name: PRECONFIGURED_USER.name,
      email: PRECONFIGURED_USER.email,
      status: PRECONFIGURED_USER.status,
    });
    return { success: true };
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
