import { auth, rtdb } from "@/config/firebaseConfig";
import { onDisconnect, ref, serverTimestamp, set } from "firebase/database";
import { useEffect } from "react";
import { AppState, AppStateStatus } from "react-native";

const useOnlineStatus = (): void => {
  useEffect(() => {
    const user = auth.currentUser;

    if (!user) {
      return;
    }
    const userStatusRef = ref(rtdb, `userStatus/${user.uid}`);

    const setOnline = (): void => {
      set(userStatusRef, {
        status: "online",
        lastActive: serverTimestamp(),
        userId: user.uid,
        email: user.email,
      })
        .then(() => {
          console.log("Online status");
        })
        .catch((err) => {
          console.log("Online Status Error:", err);
        });

      onDisconnect(userStatusRef)
        .set({
          status: "offline",
          lastActive: serverTimestamp(),
          userId: user.uid,
          email: user.email,
        })
        .then(() => {
          console.log("Offline status");
        })
        .catch((err) => {
          console.log("Offline Status Error:", err);
        });
    };

    const setOffline = (): void => {
      setTimeout(() => {
        set(userStatusRef, {
          status: "offline",
          lastActive: serverTimestamp(),
          userId: user.uid,
          email: user.email,
        }).catch((err) => {
          console.log(err);
        });
      }, 30000);
    };

    // App Change
    const handleAppStateChange = (nextAppState: AppStateStatus): void => {
      if (nextAppState === "active") {
        setOnline();
      } else if (nextAppState === "background" || nextAppState === "inactive") {
        setOffline();
      }
    };

    setOnline();

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return (): void => {
      subscription.remove();
    };
  }, []);
};

export default useOnlineStatus;
