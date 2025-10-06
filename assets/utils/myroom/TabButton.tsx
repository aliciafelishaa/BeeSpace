import { COLORS } from "@/constants/utils/colors";
import { TabButtonProps } from "@/types/myroom/myroom";
import React, { Image, Text, TouchableOpacity } from "react-native";

export default function TabButton({
  title,
  icon,
  activeIcon,
  active,
  onPress,
}: TabButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`w-[80px] h-8 rounded-[8px] border border-neutral-300 flex items-center justify-center gap-1  p-2
      ${active ? "bg-primary border-primary" : "bg-neutral-100 border-neutral-300"}`}
      style={{
        backgroundColor: active ? COLORS.primary4th : COLORS.white,
      }}
      activeOpacity={0.8}
    >
      <Image
        source={active ? activeIcon : icon}
        className="w-[16px] h-[16px]"
        resizeMode="contain"
        style={{ tintColor: active ? COLORS.primary : COLORS.neutral500 }}
      />
      <Text
        className="text-[12px] font-medium"
        style={{ color: active ? COLORS.primary : COLORS.neutral500 }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
