import { router } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";

export default function HeaderBack() {
  return (
    <View
      style={{
        position: "absolute",
        top: 50, 
        left: 16,
        zIndex: 99,
      }}
    >
      <TouchableOpacity onPress={() => router.back()}>
        <Image
          source={require("@/assets/utils/arrow-left-back.png")}
          style={{ width: 35, height: 35 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}
