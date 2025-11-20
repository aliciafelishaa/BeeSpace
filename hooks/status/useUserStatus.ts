import { rtdb } from "@/config/firebaseConfig";
import { off, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";

interface UserStatus {
  isOnline: boolean;
  lastSeen: any;
}

const useUserStatus = (userId: string | null): UserStatus => {
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [lastSeen, setLastSeen] = useState<any>(null);

  useEffect(() => {
    if (!userId) {
      setIsOnline(false);
      setLastSeen(null);
      return;
    }

    const userStatusRef = ref(rtdb, `userStatus/${userId}`);

    const unsubscribe = onValue(userStatusRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Data:", data);

      if (data) {
        setIsOnline(data.status === "online");
        setLastSeen(data.lastActive);
      } else {
        setIsOnline(false);
        setLastSeen(null);
      }
    });

    return (): void => {
      off(userStatusRef, "value", unsubscribe);
    };
  }, [userId]);

  return { isOnline, lastSeen };
};

export default useUserStatus;
