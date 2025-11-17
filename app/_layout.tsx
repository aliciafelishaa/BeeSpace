import BottomNavbar from "@/components/utils/BottomNavbar";
import { Fonts } from "@/constants/utils/fonts";
import { NAV_ITEMS } from "@/constants/utils/navbarItems";
import { AuthContext } from "@/context/AuthContext";
import { FamilyViewProvider } from "@/context/FamilyViewContext";
import "@/global.css";
import { useAuthState } from "@/hooks/useAuthState";
import { useFonts } from "expo-font";
import { Slot, SplashScreen, usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Platform, ActivityIndicator } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { auth } from "@/config/firebaseConfig";

SplashScreen.preventAutoHideAsync();

function shouldShowBottomNav(
    user: any,
    pathname: string,
    isEditing: boolean
): boolean {
    if (!user) return false;
    const hiddenPatterns = [/^\/auth/, /^\/myroom\/detailroom/];
    const isChatPage = pathname === "/directmessage/chat";

    return !hiddenPatterns.some((regex) => regex.test(pathname)) && !isChatPage;
}

function RootContent() {
    const { user, initializing } = useAuthState();
    const router = useRouter();
    const pathname = usePathname();
    const [activeTab, setActiveTab] = useState("home");
    const [fontsLoaded] = useFonts({ ...Fonts });
    const [isProfileEditing, setIsProfileEditing] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(() => {
            setIsAuthReady(true);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const yourroomAliases = [
            "/yourroom",
            "/yourroom/yourRoom",
            "/myroom/roomDashboard",
        ];

        const isMatch = (base: string, p: string) =>
            p === base || p.startsWith(base + "/");

        const current =
            [...NAV_ITEMS]
                .sort((a, b) => b.route.length - a.route.length)
                .find((item) => isMatch(item.route, pathname)) ||
            (yourroomAliases.some((a) => isMatch(a, pathname))
                ? NAV_ITEMS.find((i) => i.id === "/myroom")
                : undefined);

        if (current) setActiveTab(current.id);
    }, [pathname]);

    useEffect(() => {
        if (Platform.OS !== "web") return;

        const handleProfileEdit = (event: any) => {
            setIsProfileEditing(event.detail.editing);
        };

        window.addEventListener("profileEditChange", handleProfileEdit);
        return () =>
            window.removeEventListener("profileEditChange", handleProfileEdit);
    }, []);

    useEffect(() => {
        if (Platform.OS === "web") return;

        const isEditingPath = pathname.includes("/profile/edit") ||
            pathname.includes("?edit=true");
        setIsProfileEditing(isEditingPath);
    }, [pathname]);

    useEffect(() => {
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded]);

    const handleSelect = (id: string, route: string) => {
        setActiveTab(id);
        router.push(route as any);
    };

    if (initializing || !fontsLoaded || !isAuthReady) {
        return (
            <View style={{ flex: 1, backgroundColor: "white", justifyContent: "center", alignItems: "center" }}>
                <ActivityIndicator size="large" color="#FCBC03" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, minHeight: 0 }}>
            <View style={{ flex: 1, minHeight: 0 }}>
                <Slot />
            </View>

            {shouldShowBottomNav(user, pathname, isProfileEditing) && (
                <BottomNavbar
                    items={NAV_ITEMS}
                    activeId={activeTab}
                    onSelect={handleSelect}
                />
            )}
        </View>
    );
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <AuthContext>
                <FamilyViewProvider>
                    <RootContent />
                </FamilyViewProvider>
            </AuthContext>
        </GestureHandlerRootView>
    );
}