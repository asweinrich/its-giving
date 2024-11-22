'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  user: { userId: string; email: string } | null;
  setAuthenticated: (authStatus: boolean, userData?: { userId: string; email: string }) => void;
};

interface User {
  userId: string;
  email: string;
}

const AuthContext = React.createContext<{ user: User | null }>({ user: null });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ userId: string; email: string } | null>(null);

  //use user for now: 
  console.log(user) 

  // Check login state once on load
   useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await fetch("/api/users/verify-token", { method: "GET" });
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(data.authenticated);
          setUser(data.user);
          window.dispatchEvent(new Event("authChange")); // Notify components
        } else {
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to verify user:", error);
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    verifyUser();
  }, []);

  const setAuthenticated = (authStatus: boolean, userData?: { userId: string; email: string }) => {
    setIsAuthenticated(authStatus);
    setUser(authStatus ? userData || null : null);
    window.dispatchEvent(new Event("authChange")); // Notify components
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
