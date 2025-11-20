import { COLORS } from "@/constants/utils/colors";
import { BottomNavProps } from "@/types/nav";
import React from "react";
import { TouchableOpacity, View } from "react-native";

export default function BottomNavbar({
    items,
    activeId,
    onSelect,
}: BottomNavProps) {
    return (
        <View
            className="absolute left-0 right-0 bottom-0 w-full flex-row justify-around items-center border-t border-gray-200 bg-white z-10 rounded-t-3xl px-5"
            style={{ height: 110, backgroundColor: COLORS.white }}
        >
            {items.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeId === item.id;

                return (
                    <TouchableOpacity
                        key={item.id}
                        className="items-center flex-1"
                        onPress={() => onSelect(item.id, item.route)}
                    >
                        <View className="mb-4">
                            <IconComponent isActive={isActive} />
                        </View>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}