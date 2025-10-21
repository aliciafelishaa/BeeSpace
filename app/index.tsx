import "@/global.css";
import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuthState } from "@/hooks/useAuthState";
import { auth } from "@/config/firebaseConfig";
import { signOut } from "firebase/auth";
import { isFirstLaunch } from "@/utils/checkFirstLaunch";

export default function Index() {
    const { user, initializing } = useAuthState();
    const router = useRouter();

    useEffect(() => {
        const handleRedirect = async () => {
            if (initializing) return;

            const first = await isFirstLaunch();
            if (first) {
                await signOut(auth);
                console.log("First launch → reset session");
            }

            if (auth.currentUser) {
                console.log("User sedang login:", auth.currentUser.email);
                router.replace("/myroom/roomDashboard");
            } else {
                console.log("Belum login");
                router.replace("/auth/login");
            }
        };

        handleRedirect();
    }, [initializing, user]);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#fff",
            }}
        >
            <ActivityIndicator size="large" />
        </View>
    );
}
