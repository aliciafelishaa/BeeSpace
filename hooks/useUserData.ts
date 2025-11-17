import { getUserById } from "@/services/userService";
import { UserData } from "@/types/auth/user";
import { useEffect, useState } from "react";

export function useUserData(uid: string | undefined) {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    if (!uid) return;

    const fetchUser = async () => {
      const data = await getUserById(uid);
      setUserData(data);
    };

    fetchUser();
  }, [uid]);

  return { userData };
}
