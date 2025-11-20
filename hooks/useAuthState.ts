import { auth } from "@/config/firebaseConfig";
import useOnlineStatus from "@/hooks/status/useOnlineStatus";
import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null);
  const [initializing, setInitializing] = useState(true);

  useOnlineStatus();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser);

      if (initializing) {
        setInitializing(false);
      }
    });

    return () => unsub();
  }, [initializing]);

  return { user, initializing };
}
