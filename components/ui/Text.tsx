import React from "react";
import { Text as RNText, TextProps, StyleProp, TextStyle } from "react-native";

type CustomTextProps = TextProps & {
    weight?: "Regular" | "Medium" | "SemiBold" | "Bold";
    style?: StyleProp<TextStyle>;
};

export default function Text({ weight = "Regular", style, ...props }: CustomTextProps) {
    const fontMap: Record<string, string> = {
        Regular: "Inter_400Regular",
        Medium: "Inter_500Medium",
        SemiBold: "Inter_600SemiBold",
        Bold: "Inter_700Bold",
    };

    return (
        <RNText
            {...props}
            style={[{ fontFamily: fontMap[weight] || "Inter_400Regular" }, style]}
        />
    );
}
