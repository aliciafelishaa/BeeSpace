import { COLORS } from "@/constants/utils/colors";
import { TimeCategoryProps } from "@/types/myroom/myroom";
import React, { Text, TouchableOpacity } from "react-native";

export default function TimeButton({
  title,
  active,
  onPress,
}: TimeCategoryProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={` h-[40px] w-[100px] rounded-[8px] border border-neutral-300 flex items-center justify-center gap-1 p-2
        ${active ? "bg-primary border-primary" : "bg-neutral-100 border-neutral-300"}`}
      style={{
        backgroundColor: active ? COLORS.primary4th : COLORS.white,
      }}
      activeOpacity={0.8}
    >
      <Text
        className="text-[12px] font-interMedium"
        style={{
          color: active ? COLORS.primary : COLORS.neutral500,
        }}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}
