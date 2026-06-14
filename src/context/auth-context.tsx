"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types/user";
import { fetchUser, logoutUser as logoutUser } from "@/actions/auth";
import toast from "react-hot-toast";

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    isAdmin: boolean;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    isAdmin: false,
    logout: () => {
    }
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!user;

    const isAdmin = false // !!user?.roles?.some((role: { id: number, name: string }) => role.id === 1 && role.name === "admin");

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await fetchUser();
                setUser(userData || null);
            } catch {
                toast.error("We couldn't load your session. Please sign in again.");
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData().then();
    }, []);

    const logout = async () => {
        try {
            await logoutUser();
        } catch {
            toast.error("We couldn't sign you out. Please try again.");
        }

        setUser(null);
        window.location.reload();
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, isAuthenticated, isAdmin, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
