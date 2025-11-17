import { COLORS } from "@/constants/utils/colors";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export type ProfileMenuKey =
  | "profile"
  | "personal"
  | "password"
  | "logout";

export interface ProfileMenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (key: ProfileMenuKey) => void;
}

type MenuItem = {
  key: ProfileMenuKey;
  label: string;
  icon: any;
  destructive?: boolean;
};

export const ProfileMenuModal: React.FC<ProfileMenuModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const insets = useSafeAreaInsets(); 
  const slideY = useRef(new Animated.Value(320)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.parallel([
        Animated.spring(slideY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0.5,
          duration: 220,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideY, {
          toValue: 320,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isOpen, slideY, backdropOpacity]);

  const menu: MenuItem[] = [
    {
      key: "profile",
      label: "Profile",
      icon: require("@/assets/profile/icon-user.png"),
    },
    {
      key: "password",
      label: "Change Password",
      icon: require("@/assets/profile/icon-password.png"),
    },
    {
      key: "logout",
      label: "Logout",
      icon: require("@/assets/profile/icon-logout.png"),
      destructive: true,
    },
  ];

  const onPressItem = (key: ProfileMenuKey) => {
    onClose();
    onNavigate?.(key);
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          opacity: backdropOpacity,
        }}
      >
        <Pressable 
          style={{ flex: 1 }} 
          accessibilityLabel="Close menu"
          onPress={onClose}
        />
      </Animated.View>

      <Animated.View
        style={{
          position: 'absolute', 
          bottom: 0,
          left: 0,
          right: 0,
          transform: [{ translateY: slideY }],
        }}
      >
        <View
          style={{
            backgroundColor: COLORS.white,
            borderTopLeftRadius: 24, 
            borderTopRightRadius: 24,
            overflow: 'hidden', 
            paddingBottom: Math.max(insets.bottom, 12),
          }}
        >
          <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
            <Text
              style={{
                fontSize: 16, 
                fontWeight: "600", 
                color: COLORS.neutral900,
              }}
            >
              Profile Options
            </Text>
          </View>

          <View
            style={{
              height: 1,
              backgroundColor: COLORS.neutral300,
              opacity: 0.6,
            }}
          />

          <View style={{ paddingHorizontal: 8, paddingVertical: 8 }}>
            {menu.map((item, idx) => (
              <View key={item.key}>
                <TouchableOpacity
                  style={{
                    flexDirection: "row", 
                    alignItems: "center", 
                    columnGap: 12, 
                    paddingHorizontal: 16, 
                    paddingVertical: 16,
                    borderRadius: 12, 
                  }}
                  activeOpacity={0.7}
                  accessibilityLabel={item.label}
                  onPress={() => onPressItem(item.key)}
                >
                  <Image
                    source={item.icon}
                    style={{ width: 20, height: 20 }} 
                    resizeMode="contain"
                  />
                  
                  <Text
                    style={{
                      fontSize: 15,
                      color: item.destructive ? "#DC2626" : COLORS.neutral900,
                    }}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>

                {idx < menu.length - 1 && (
                  <View
                    style={{
                      marginHorizontal: 16, 
                      height: 1,
                      backgroundColor: COLORS.neutral300,
                      opacity: 0.5,
                    }}
                  />
                )}
              </View>
            ))}
          </View>
        </View>
      </Animated.View>
    </Modal>
  );
};