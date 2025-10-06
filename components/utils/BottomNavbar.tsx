import { COLORS } from "@/constants/utils/colors";
import { BottomNavProps } from "@/types/nav";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

export default function BottomNavbar({
  items,
  activeId,
  onSelect,
}: BottomNavProps) {
  return (
    <View
      className="absolute left-0 right-0 bottom-0 w-full flex-row justify-around items-center border-t border-gray-200 bg-white z-10 rounded-t-3xl px-5 pt-4"
      style={{ height: 110, backgroundColor: COLORS.white }}
    >
      {items.map((item) => (
        <TouchableOpacity
          key={item.id}
          className="items-center flex-1"
          onPress={() => onSelect(item.id, item.route)}
        >
          <Image
            source={activeId === item.id ? item.activeIcon : item.icon}
            className="w-[26px] h-[26px] mb-4"
            resizeMode="contain"
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}
