import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "../types";
import { authAPI } from "../services/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
    role?: string
  ) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      authAPI
        .validateToken(token)
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem("authToken");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (username: string, password: string) => {
    const { user: userData, token } = await authAPI.login(username, password);
    localStorage.setItem("authToken", token);
    setUser(userData);
  };

  const register = async (
    username: string,
    email: string,
    password: string,
    role?: string
  ) => {
    const { user: userData, token } = await authAPI.register(
      username,
      email,
      password,
      role
    );
    localStorage.setItem("authToken", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
