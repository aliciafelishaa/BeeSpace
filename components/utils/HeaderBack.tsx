import { router } from "expo-router";
import React from "react";
import { Image, TouchableOpacity, View } from "react-native";
import { Back } from "@/components/ui/IconDash";

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
        <Back/>
      </TouchableOpacity>
    </View>
  );
}
