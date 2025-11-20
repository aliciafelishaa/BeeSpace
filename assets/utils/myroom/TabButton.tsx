import { COLORS } from "@/constants/utils/colors";
import { TabButtonProps } from "@/types/myroom/myroom";
import React, { Image, View, Text, TouchableOpacity } from "react-native";

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
      className={`w-[80px] h-[64px] rounded-[8px] border border-neutral-300 flex flex-col items-center justify-center p-2 ${active ? "bg-primary border-primary" : "bg-neutral-100 border-neutral-300"}`}
      style={{
        backgroundColor: active ? COLORS.primary4th : COLORS.white,
      }}
      activeOpacity={0.8}
    >
      <View style={{ width: 16, height: 16 }}>
        {active ? activeIcon : icon}
      </View>

      <Text
        className="text-[12px] font-medium font-interMedium mt-1"
        style={{ color: active ? COLORS.primary : COLORS.neutral500 }}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
