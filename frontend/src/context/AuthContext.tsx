"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { UserProfile, AuthContextType } from "@/types/warranty"; 

// Giá trị Context mặc định
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props cho AuthProvider
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // 1. Trạng thái lưu trữ thông tin người dùng
  const [user, setUser] = useState<UserProfile | null>(null);
  const isAuthenticated = !!user;

  // 2. Hàm đăng nhập
  const login = (userData: UserProfile) => {
    setUser(userData);
  };

  // 3. Hàm đăng xuất
  const logout = () => {
    setUser(null);
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để sử dụng Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};