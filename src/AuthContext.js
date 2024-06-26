// AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const signIn = () => setIsAuthenticated(true);
  const signUp = () => setIsAuthenticated(true);
  const signOut = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut, signUp }}>
      {children}
    </AuthContext.Provider>
  );
};
