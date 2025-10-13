import { useAuthState } from "@/hooks/useAuthState";
import { AuthContextProp } from "@/types/auth/auth";
import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect } from "react";

const AuthProp = createContext<AuthContextProp>({
  user: null,
  initializing: true,
});

export function AuthContext({ children }: { children: React.ReactNode }) {
  const { user, initializing } = useAuthState();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (initializing) return;

    const inAuthGroup = segments[0] === "auth";

    if (user && !inAuthGroup) {
      return;
    }
      // else if (!user && !inAuthGroup) {
      //   router.push("/auth/login/login" as any);
      // }
  }, [user, initializing, segments]);

  return (
    <AuthProp.Provider value={{ user, initializing }}>
      {children}
    </AuthProp.Provider>
  );
}

export function useAuth() {
  return useContext(AuthProp);
}
