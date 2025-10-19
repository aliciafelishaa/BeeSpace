// components/profile/ProfileMenuModal.tsx
import { COLORS } from "@/constants/utils/colors";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Image, Modal, Text, TouchableOpacity, View } from "react-native";

interface ProfileMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type MenuItem = {
  label: string;
  icon: any;                 
  destructive?: boolean;
  onPress: () => void;
};

export const ProfileMenuModal: React.FC<ProfileMenuModalProps> = ({
  isOpen,
  onClose,
}) => {
  const slideY = useRef(new Animated.Value(300)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.spring(slideY, { toValue: 0, useNativeDriver: true, tension: 65, friction: 11 }),
        Animated.timing(backdropOpacity, { toValue: 0.5, duration: 220, useNativeDriver: true }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideY, { toValue: 300, duration: 220, useNativeDriver: true }),
        Animated.timing(backdropOpacity, { toValue: 0, duration: 180, useNativeDriver: true }),
      ]).start();
    }
  }, [isOpen]);

  const handleLogout = () => {
    onClose();
    // TODO: inject logout flow di sini (clear token/state, navigate to auth)
    // auth.signOut(); router.replace("/auth/login");
  };

  const menuOptions: MenuItem[] = [
    {
      label: "Edit Profile",
      icon: require("@/assets/profile/icon-gears.png"),
      onPress: () => { onClose(); router.push("/profile/edit"); },
    },
    {
      label: "Personal Information",
      icon: require("@/assets/profile/icon-user.png"),
      onPress: () => { onClose(); router.push("/settings/personal-info"); },
    },
    {
      label: "History",
      icon: require("@/assets/profile/icon-history.png"),
      onPress: () => { onClose(); router.push("/profile/history"); },
    },
    {
      label: "Change Password",
      icon: require("@/assets/profile/icon-password.png"),
      onPress: () => { onClose(); router.push("/settings/change-password"); },
    },
    {
      label: "Logout",
      icon: require("@/assets/profile/icon-logout.png"),
      destructive: true,
      onPress: handleLogout,
    },
  ];

  return (
    <Modal visible={isOpen} transparent animationType="none" onRequestClose={onClose}>
      {/* Backdrop */}
      <Animated.View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", opacity: backdropOpacity }}>
        <TouchableOpacity className="flex-1" activeOpacity={1} onPress={onClose} accessibilityLabel="Close menu" />
      </Animated.View>

      {/* Sheet */}
      <Animated.View
        className="absolute bottom-0 left-0 right-0 rounded-t-3xl"
        style={{ backgroundColor: COLORS.white, transform: [{ translateY: slideY }] }}
      >
        <View className="px-5 py-4">
          <Text className="text-base font-semibold" style={{ color: COLORS.neutral900 }}>
            Profile Options
          </Text>
        </View>

        <View className="border-0" style={{ borderColor: COLORS.neutral300 }} />

        <View className="px-2 py-2">
          {menuOptions.map((item, idx) => (
            <View key={item.label}>
              <TouchableOpacity
                className="flex-row items-center gap-3 px-4 py-4 rounded-xl"
                activeOpacity={0.7}
                onPress={item.onPress}
                accessibilityLabel={item.label}
              >
                <Image source={item.icon} className="w-5 h-5" resizeMode="contain" />
                <Text
                  className="text-[15px]"
                  style={{ color: item.destructive ? "#DC2626" : COLORS.neutral900 }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>

              {idx < menuOptions.length - 1 && (
                <View className="mx-4 h-[1px]" style={{ backgroundColor: COLORS.neutral300 }} />
              )}
            </View>
          ))}
        </View>

        <View className="h-5" />
      </Animated.View>
    </Modal>
  );
};
