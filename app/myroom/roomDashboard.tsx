import { COLORS } from "@/constants/utils/colors";
import React, { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyRoomDash() {
  return (
    <SafeAreaView
      className="bg-white-100"
      style={{ backgroundColor: COLORS.neutral100, flex: 1 }}
    >
      <ScrollView>
        <View>Test</View>
      </ScrollView>
    </SafeAreaView>
  );
}
