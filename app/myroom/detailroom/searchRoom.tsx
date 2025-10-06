import HeaderBack from "@/components/utils/HeaderBack";
import SearchBar from "@/components/utils/SearchBar";
import { COLORS } from "@/constants/utils/colors";
import React from "react";
import { View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function SearchRoom() {
  const insets = useSafeAreaInsets();

  const HEADER_WIDTH = 35 + 16 + 8;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mt-4">
          <HeaderBack />

          <View
            style={{
              paddingLeft: HEADER_WIDTH,
              paddingRight: 16,
              marginTop: 45,
            }}
          >
            <SearchBar
              placeholder="Search Activity"
              onChangeText={(text) => console.log(text)}
              containerStyle={{ width: "100%" }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
