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
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

SplashScreen.preventAutoHideAsync();

function shouldShowBottomNav(user: any, pathname: string): boolean {
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

  useNotifications();

  useEffect(() => {
    const yourroomAliases = [
      "/yourroom",
      "/yourroom/yourRoom",
      "/myroom/roomDashboard",
    ];
    useEffect(() => {
      const yourroomAliases = [
        "/yourroom",
        "/yourroom/yourRoom",
        "/myroom/roomDashboard",
      ];

      const isMatch = (base: string, p: string) =>
        p === base || p.startsWith(base + "/");
      const isMatch = (base: string, p: string) =>
        p === base || p.startsWith(base + "/");

      const current =
        [...NAV_ITEMS]
          .sort((a, b) => b.route.length - a.route.length)
          .find((item) => isMatch(item.route, pathname)) ||
        (yourroomAliases.some((a) => isMatch(a, pathname))
          ? NAV_ITEMS.find((i) => i.id === "/myroom")
          : undefined);
      const current =
        [...NAV_ITEMS]
          .sort((a, b) => b.route.length - a.route.length)
          .find((item) => isMatch(item.route, pathname)) ||
        (yourroomAliases.some((a) => isMatch(a, pathname))
          ? NAV_ITEMS.find((i) => i.id === "/myroom")
          : undefined);

      if (current) setActiveTab(current.id);
    }, [pathname]);
    if (current) setActiveTab(current.id);
  }, [pathname]);

  useEffect(() => {
    const handleProfileEdit = (event: any) => {
      setIsProfileEditing(event.detail.editing);
    };
    useEffect(() => {
      const handleProfileEdit = (event: any) => {
        setIsProfileEditing(event.detail.editing);
      };

      window.addEventListener("profileEditChange", handleProfileEdit);
      return () =>
        window.removeEventListener("profileEditChange", handleProfileEdit);
    }, []);
    window.addEventListener("profileEditChange", handleProfileEdit);
    return () =>
      window.removeEventListener("profileEditChange", handleProfileEdit);
  }, []);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);
  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  const handleSelect = (id: string, route: string) => {
    setActiveTab(id);
    router.push(route as any);
  };
  const handleSelect = (id: string, route: string) => {
    setActiveTab(id);
    router.push(route as any);
  };

  if (initializing || !fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "white" }} />;
  }
  if (initializing || !fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: "white" }} />;
  }

  return (
    <View style={{ flex: 1, minHeight: 0 }}>
      <View style={{ flex: 1, minHeight: 0 }}>
        <Slot />
      </View>
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
