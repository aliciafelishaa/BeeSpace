import React, { createContext, useContext } from "react"
import { useAuthState } from "@/hooks/useAuthState"
import { AuthContextProp } from "@/types/auth/auth"

const AuthProp = createContext<AuthContextProp>({ user: null, initializing: true })

export function AuthContext({ children }: { children: React.ReactNode }) {
    const { user, initializing } = useAuthState()

    return (
        <AuthProp.Provider value={{ user, initializing }}>
            {children}
        </AuthProp.Provider>
    )
}

export function useAuth() {
    return useContext(AuthProp)
}