import { COLORS } from "@/constants/utils/colors";
import React, { useState } from "react";
import {
  Image,
  ImageSourcePropType,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";

type Props = {
  uri?: string | ImageSourcePropType;
  onPick?: () => void;
  editable?: boolean;
  size?: number;            
  editButtonSize?: number;
};

export function ProfileAvatarPicker({
  uri,
  onPick,
  editable = true,
  size = 160,     
  editButtonSize = 36 
}: Props) {
  const [failed, setFailed] = useState(false);
  const placeholder = require("@/assets/profile/empty-profile.jpg");

  const source =
    failed
      ? placeholder
      : typeof uri === "string"
      ? { uri }
      : (uri as ImageSourcePropType) ?? placeholder;

  const radius = size / 2;
  const badge = Math.max(28, Math.min(editButtonSize, 48));

  return (
    <View className="items-center mt-2">
      <View className="relative">
        {/* Bungkus Image dengan TouchableOpacity jika editable */}
        {editable && onPick ? (
          <TouchableOpacity 
            onPress={onPick}
            activeOpacity={0.9}
            accessibilityLabel="Change avatar"
          >
            <Image
              source={source}
              onError={() => setFailed(true)}
              style={{
                width: size,
                height: size,
                borderRadius: radius,
                backgroundColor: COLORS.neutral300,
                borderWidth: 1,
                borderColor: COLORS.neutral300,  
              }}
              resizeMode="cover"               
            />
          </TouchableOpacity>
        ) : (
          <Image
            source={source}
            onError={() => setFailed(true)}
            style={{
              width: size,
              height: size,
              borderRadius: radius,
              backgroundColor: COLORS.neutral300,
              borderWidth: 1,
              borderColor: COLORS.neutral300,  
            }}
            resizeMode="cover"               
          />
        )}

        {/* Hanya tampilkan tombol edit jika editable = true DAN onPick tersedia */}
        {editable && onPick && (
          <TouchableOpacity
            onPress={onPick}
            accessibilityLabel="Edit avatar"
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={{
              position: "absolute",
              right: 8,
              bottom: 8,
              width: badge,
              height: badge,
              borderRadius: badge / 2,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: COLORS.white,
              // shadow iOS
              shadowColor: "#000",
              shadowOpacity: 0.12,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 2 },
              // elevation Android
              ...(Platform.OS === "android" ? { elevation: 3 } : {}),
            }}
          >
            <View
              style={{
                width: badge - 8,
                height: badge - 8,
                borderRadius: (badge - 8) / 2,
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: COLORS.white,
              }}
            >
              <Image
                source={require('@/assets/profile/icon-edit.png')}
                style={{
                  width: 20,  
                  height: 20, 
                }}
                resizeMode="contain" 
              />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}