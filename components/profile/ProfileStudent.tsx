import { COLORS } from "@/constants/utils/colors";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
  label: string;
  value?: string;
  placeholder?: string;
  onValueChange: (value: string) => void;
  required?: boolean;
};

export function ProfileStudent({
  label,
  value,
  placeholder,
  onValueChange,
  required,
}: Props) {
  const hasValue = value && value.length > 0;

  return (
    <View className="space-y-2">
      {/* Label */}
      <Text
        style={{ fontFamily: "Inter_600SemiBold", color: COLORS.neutral900 }}
        className="text-[13px]"
      >
        {label}
        {required && <Text className="text-[#EF4444]"> *</Text>} {/* Gatau kenapa gabisa pake color error */}
      </Text>

      {/* Tombol Picker */}
      <TouchableOpacity
        style={{
          borderWidth: 1,
          borderColor: COLORS.neutral300,
          backgroundColor: COLORS.white,
          borderRadius: 12,
          paddingHorizontal: 16,
          paddingVertical: 14,
          height: 50,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        activeOpacity={0.7}
        onPress={() => alert("Ini dropdown")}
      >
        <Text
          style={{
            fontFamily: "Inter_400Regular",
            fontSize: 15,
            color: hasValue ? COLORS.neutral900 : COLORS.neutral500,
          }}
        >
          {hasValue ? value : placeholder}
        </Text>

        <Image
          source={require("@/assets/profile/icon-dropdown.png")}
          style={{
            width: 20, 
            height: 20, 
            tintColor: COLORS.neutral500, 
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}