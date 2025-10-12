// import { auth } from "@/config/firebaseConfig";
// import { onAuthStateChanged, User } from "firebase/auth";
// import { useEffect, useState } from "react";

// export function useAuthState() {
//   const [user, setUser] = useState<User | null>(null);
//   const [initializing, setInitializing] = useState(true);

//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (currUser) => {
//       setUser(currUser);

//       if (initializing) {
//         setInitializing(false);
//       }
//     });

//     return () => unsub();
//   }, []);

//   return { user, initializing };
// }
// hooks/useAuthState.ts  — FRONTEND-ONLY (tanpa Firebase)
import { useMemo } from "react";

export type AuthUser = {
  uid: string;
  email?: string | null;
  displayName?: string | null;
} | null;

// Tidak ada import dari 'firebase/auth' di file ini.
export function useAuthState(): { user: AuthUser; initializing: boolean } {
  // Atur sesuai kebutuhan UI kamu:
  const user: AuthUser = null; 
  // contoh bila mau simulasi logged-in:
  // const user: AuthUser = { uid: "demo", email: "demo@beespace.app", displayName: "Demo" };

  // initializing dibuat false agar UI langsung render
  return useMemo(() => ({ user, initializing: false }), [user]);
}
