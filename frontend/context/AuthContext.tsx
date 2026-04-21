"use client"

import React, { createContext, useContext, useState } from "react"
import { useRouter } from "@/i18n/navigation"

export interface Address {
    id: number
    userId: number
    recipientName: string
    streetAddress: string
    district: string
    postalCode: string
    city: string
    buildingNumber: string
    secondaryNumber: string
    phoneNumber: string
    label: string
    isDefault: boolean
    createdAt: string
    updatedAt: string
}

export interface User {
    id: number
    email: string
    role: string
    address?: Address
}

interface AuthContextType {
    user: User | null
    token: string | null
    login: (token: string, user: User) => void
    logout: () => void
    isAuthenticated: boolean
    isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [authState, setAuthState] = useState<{
        user: User | null
        token: string | null
        isLoading: boolean
    }>(() => {
        if (typeof window === "undefined") {
            return { user: null, token: null, isLoading: true }
        }

        const storedToken = localStorage.getItem("token")
        const storedUser = localStorage.getItem("user")

        if (!storedToken || !storedUser) {
            return { user: null, token: null, isLoading: false }
        }

        try {
            return {
                user: JSON.parse(storedUser) as User,
                token: storedToken,
                isLoading: false,
            }
        } catch {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            return { user: null, token: null, isLoading: false }
        }
    })
    const router = useRouter()
    const { user, token, isLoading } = authState

    const login = (newToken: string, newUser: User) => {
        setAuthState({
            user: newUser,
            token: newToken,
            isLoading: false,
        })
        localStorage.setItem("token", newToken)
        localStorage.setItem("user", JSON.stringify(newUser))
    }

    const logout = () => {
        setAuthState({
            user: null,
            token: null,
            isLoading: false,
        })
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        router.push("/auth/login")
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                isAuthenticated: !!token,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
