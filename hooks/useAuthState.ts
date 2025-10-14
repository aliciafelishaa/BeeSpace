import { auth } from "@/config/firebaseConfig"
import { onAuthStateChanged, User } from "firebase/auth"
import { useEffect, useState } from "react"

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null)
  const [initializing, setInitializing] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currUser) => {
      setUser(currUser)

      if (initializing) {
        setInitializing(false)
      }
    })

    return () => unsub()
  }, [])

  return { user, initializing }
}