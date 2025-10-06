import TabButton from "@/assets/utils/myroom/TabButton";
import TimeButton from "@/assets/utils/myroom/TimeButton";
import { COLORS } from "@/constants/utils/colors";
import { RoomCategory, TimeCategory } from "@/types/myroom/myroom";
import React, { useState } from "react";
import { Image, ScrollView, Text, View } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

export default function MyRoomDash() {
  const [activeTab, setActiveTab] = useState<RoomCategory>("all");
  const [activeFilter, setActiveFilter] = useState<TimeCategory>("today");
  return (
    <SafeAreaView
      className="bg-neutral-100"
      style={{ backgroundColor: COLORS.white, flex: 1 }}
    >
      <View className="px-[13px] pt-[35px] pb-[15px] ">
        <View className="bg-white">
          {/* Header */}
          <View className="flex-row items-center justify-between">
            <View className="gap-[8px]">
              <Text className="text-neutral-500 text-[10px]">
                Activities Near
              </Text>
              <View className="flex-row gap-2 items-center">
                <Image
                  source={require("@/assets/utils/map.png")}
                  className="w-16 h-16"
                ></Image>
                <Text className="text-neutral-700 font-semibold  text-[12px]">
                  Binus Kemanggisan{" "}
                </Text>
                <Image
                  source={require("@/assets/utils/arrow-down.png")}
                  className="w-16 h-16"
                ></Image>
              </View>
            </View>
            <View>
              <Image
                source={require("@/assets/utils/notifications.png")}
                className="w-40 h-40"
              ></Image>
            </View>
          </View>

          {/* Search */}
          <View className="flex-row items-center mt-4 gap-2 justify-between">
            <View className="border border-neutral-300 p-3 flex-1 h-[40px] justify-between flex-row items-center rounded-[8px]">
              <Text className="text-[12px] text-neutral-500">
                Search Activity
              </Text>
              <Image
                source={require("@/assets/utils/search-icon.png")}
                className="w-16 h-16"
              ></Image>
            </View>
            <View className="border border-neutral-300 p-2 w-[80px] h-[40px] items-center justify-center rounded-[8px]">
              <Image
                source={require("@/assets/utils/setting-icon.png")}
                className="w-16 h-16"
              ></Image>
            </View>
          </View>

          {/* Pilihan Category */}
          <View className="mt-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              <TabButton
                title="All"
                icon={require("@/assets/utils/passive-icon/globe.svg")}
                activeIcon={require("@/assets/utils/active-icon/globe.svg")}
                active={activeTab === "all"}
                onPress={() => setActiveTab("all")}
              />
              <TabButton
                title="Sport"
                icon={require("@/assets/utils/passive-icon/running.svg")}
                activeIcon={require("@/assets/utils/active-icon/running.svg")}
                active={activeTab === "sport"}
                onPress={() => setActiveTab("sport")}
              />
              <TabButton
                title="Hangout"
                icon={require("@/assets/utils/passive-icon/hangout.svg")}
                activeIcon={require("@/assets/utils/active-icon/hangout.svg")}
                active={activeTab === "hangout"}
                onPress={() => setActiveTab("hangout")}
              />
              <TabButton
                title="Learning"
                icon={require("@/assets/utils/passive-icon/learning.svg")}
                activeIcon={require("@/assets/utils/active-icon/learning.svg")}
                active={activeTab === "learning"}
                onPress={() => setActiveTab("learning")}
              />
              <TabButton
                title="Events"
                icon={require("@/assets/utils/passive-icon/events.svg")}
                activeIcon={require("@/assets/utils/active-icon/events.svg")}
                active={activeTab === "events"}
                onPress={() => setActiveTab("events")}
              />
              <TabButton
                title="Hobby"
                icon={require("@/assets/utils/passive-icon/hobby.svg")}
                activeIcon={require("@/assets/utils/active-icon/hobby.svg")}
                active={activeTab === "hobby"}
                onPress={() => setActiveTab("hobby")}
              />
            </ScrollView>
          </View>

          {/* Hari */}
          <View className="mt-4">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 8 }}
            >
              <TimeButton
                title="Today"
                active={activeFilter === "today"}
                onPress={() => setActiveFilter("today")}
              />
              <TimeButton
                title="This Week"
                active={activeFilter === "thisweek"}
                onPress={() => setActiveFilter("thisweek")}
              />
              <TimeButton
                title="This Month"
                active={activeFilter === "thismonth"}
                onPress={() => setActiveFilter("thismonth")}
              />
              <TimeButton
                title="My Campus"
                active={activeFilter === "mycampus"}
                onPress={() => setActiveFilter("mycampus")}
              />
            </ScrollView>
          </View>
        </View>
        <View className="bg-neutral-100"></View>
      </View>

      <View
        className="w-100% bg-neutral-500"
        style={{ backgroundColor: COLORS.neutral100, flex: 1 }}
      ></View>
    </SafeAreaView>
  );
}
