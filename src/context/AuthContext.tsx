import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthContextType, User } from '../types';



const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isloading, setIsLoading] = useState<boolean>(true);
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
      }, []);

    const login = (newToken: string, userData: User) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setToken(newToken);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem('token');
        window.location.href = "/login";
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{  token, login, logout, isloading, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};