    "use client";

    import React, { createContext, useContext, useState, ReactNode } from 'react';
    import { UserProfile, AuthContextType } from '@/types/warranty';

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
        logout
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
    return context;
    };