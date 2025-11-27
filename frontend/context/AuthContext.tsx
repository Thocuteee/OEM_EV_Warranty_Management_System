"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
// Import từ types/auth (theo bước sửa lỗi trước)
import { UserProfile, AuthContextType } from '@/types/auth'; 

const AuthContext = createContext<AuthContextType | undefined>(undefined);
    
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);

    const login = (userData: UserProfile) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };
    
    const updateProfile = (profileUpdate: Partial<UserProfile>) => {
        setUser(prevUser => {
            if (!prevUser) return null;
            
            // Cập nhật state một cách bất biến
            const newUser = { ...prevUser, ...profileUpdate };
            
            // Cập nhật cả localStorage
            localStorage.setItem('user', JSON.stringify(newUser)); 
            
            return newUser;
        });
    };
    // ---------------------------------------------

    React.useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser)); 
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            isAuthenticated: !!user,
            login,
            logout,
            updateProfile 
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context as AuthContextType; 
};