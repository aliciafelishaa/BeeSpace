import { COLORS } from "@/constants/utils/colors";
import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

type Props = TextInputProps & {
  label: string;
  required?: boolean;
  containerClassName?: string;
  textClassName?: string;
};

export function ProfileField({
  label,
  required,
  containerClassName = "",
  textClassName = "",
  ...props
}: Props) {
  return (
    <View className={`space-y-2 ${containerClassName}`}>
      {/* Label */}
      <Text
        style={{ fontFamily: "Inter_600SemiBold", color: COLORS.neutral900 }}
        className="text-[13px]"
      >
        {label}{" "}
        {required && <Text className="text-[#EF4444]">*</Text>} {/* Gatau kenapa gabisa panggil color error*/}
      </Text>

      {/* Input */}
      <TextInput
        className={`rounded-xl px-4 py-3 text-[15px] ${textClassName}`}
        style={{
          borderWidth: 1,
          borderColor: COLORS.neutral300,
          backgroundColor: COLORS.white,
          color: COLORS.neutral900,
          fontFamily: "Inter_400Regular",
        }}
        placeholderTextColor={COLORS.neutral500}
        {...props}
      />
    </View>
  );
}

