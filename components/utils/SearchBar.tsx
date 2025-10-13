// src/components/utils/SearchBar.tsx
import { COLORS } from "@/constants/utils/colors";
import React from "react";
import {
  Image,
  TextInput,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type SearchBarProps = {
  placeholder?: string;
  containerStyle?: ViewStyle;
  onChangeText?: (text: string) => void;
  value?: string;
};

export default function SearchBar({
  placeholder = "Search",
  containerStyle,
  onChangeText,
  value,
}: SearchBarProps) {
  return (
    <View
      style={[
        {
          flexDirection: "row",
          alignItems: "center",
          borderWidth: 1,
          borderColor: "#D1D5DB",
          borderRadius: 8,
          height: 44,
          flex: 1,
          paddingRight: 10,
        },
        containerStyle,
      ]}
    >
      <TextInput
        placeholder={placeholder}
        style={{
          flex: 1,
          fontSize: 14,
          color: COLORS.neutral500,
          paddingHorizontal: 10,
          height: 40,
          borderRadius: 8,
        }}
        onChangeText={onChangeText}
        value={value}
      />
      <TouchableOpacity>
        <Image
          source={require("@/assets/utils/search-icon.png")}
          style={{ width: 16, height: 16 }}
        />
      </TouchableOpacity>
    </View>
  );
}
