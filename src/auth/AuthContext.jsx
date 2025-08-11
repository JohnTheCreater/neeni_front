import React, { createContext, useContext, useEffect, useState } from "react";
import { setLogoutHandler } from "../api/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true)

  const login = () => setIsLoggedIn(true);

  const logout = () => setIsLoggedIn(false);
  useEffect(()=>{
    setLogoutHandler(logout);
  },[])

  return (
    <AuthContext.Provider value={{ login, logout, isLoggedIn}}>
      {children}
    </AuthContext.Provider>
  );
};
