import React from "react"
import { Text as RNText, TextProps } from "react-native"

export default function Text({ style, ...props }: TextProps) {
  return <RNText {...props} style={[{ fontFamily: "Inter_400Regular" }, style]} />
}
