import CardRoom from "@/assets/component/myroom/CardRoom";
import ModalFilteringDynamic from "@/assets/component/myroom/ModalFiltering";
import TabButton from "@/assets/utils/myroom/TabButton";
import TimeButton from "@/assets/utils/myroom/TimeButton";
import SearchBar from "@/components/utils/SearchBar";
import { COLORS } from "@/constants/utils/colors";
import { RoomCategory, TimeCategory } from "@/types/myroom/myroom";
import { router } from "expo-router";
import React, { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function MyRoomDash() {
  const [activeTab, setActiveTab] = useState<RoomCategory>("all");
  const [activeFilter, setActiveFilter] = useState<TimeCategory>("today");
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);

  const events = [
    {
      id: 1,
      title: "Morning Run 5K",
      date: "22 Sept 2025, 18.00 - 20.00 WIB",
      location: "Gelora Bung Karno",
      slotRemaining: 5,
      slotTotal: 10,
      hostName: "Balqis",
      imageSource: false,
    },
    {
      id: 2,
      title: "Yoga Class",
      date: "25 Sept 2025, 07.00 - 09.00 WIB",
      location: "Taman Suropati",
      slotRemaining: 8,
      slotTotal: 12,
      hostName: "Alicia",
      imageSource: false,
    },
    {
      id: 3,
      title: "Tech Meetup",
      date: "28 Sept 2025, 13.00 - 16.00 WIB",
      location: "Binus Anggrek",
      slotRemaining: 3,
      slotTotal: 20,
      hostName: "Bryan",
      imageSource: false,
    },
    {
      id: 4,
      title: "Photography Walk",
      date: "30 Sept 2025, 09.00 - 11.00 WIB",
      location: "Kota Tua Jakarta",
      slotRemaining: 7,
      slotTotal: 15,
      hostName: "Tasya",
      imageSource: false,
    },
    {
      id: 5,
      title: "Community Cleanup",
      date: "2 Okt 2025, 08.00 - 10.30 WIB",
      location: "Pantai Indah Kapuk",
      slotRemaining: 2,
      slotTotal: 10,
      hostName: "Akbar",
      imageSource: false,
    },
    {
      id: 6,
      title: "Cooking Workshop",
      date: "4 Okt 2025, 10.00 - 12.00 WIB",
      location: "Mall Kelapa Gading",
      slotRemaining: 6,
      slotTotal: 12,
      hostName: "Putri",
      imageSource: false,
    },
    {
      id: 7,
      title: "Coding Bootcamp",
      date: "6 Okt 2025, 09.00 - 17.00 WIB",
      location: "Jakarta Digital Valley",
      slotRemaining: 10,
      slotTotal: 25,
      hostName: "Cornelius",
      imageSource: false,
    },
    {
      id: 8,
      title: "Charity Concert",
      date: "10 Okt 2025, 18.00 - 22.00 WIB",
      location: "Senayan City Hall",
      slotRemaining: 12,
      slotTotal: 30,
      hostName: "Tasya",
      imageSource: false,
    },
    {
      id: 9,
      title: "Art Exhibition",
      date: "12 Okt 2025, 11.00 - 14.00 WIB",
      location: "Museum MACAN",
      slotRemaining: 9,
      slotTotal: 20,
      hostName: "Balqis",
      imageSource: false,
    },
    {
      id: 10,
      title: "Startup Pitch Night",
      date: "15 Okt 2025, 17.00 - 20.00 WIB",
      location: "GoWork Plaza Indonesia",
      slotRemaining: 4,
      slotTotal: 15,
      hostName: "Alicia",
      imageSource: false,
    },
  ];

  return (
    <SafeAreaView
      className="bg-neutral-100"
      style={{
        backgroundColor: COLORS.white,
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-[13px] pt-[35px] pb-[15px] ">
          <View className="bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between">
              <View className="gap-[10px]">
                <Text className="text-neutral-500 text-[12px] font-inter">
                  Activities Near
                </Text>
                <View className="flex-row gap-2 items-center">
                  <Image
                    source={require("@/assets/utils/map.png")}
                    className="w-[16px] h-[16px]"
                  ></Image>
                  <Text className="text-neutral-700 font-semibold  text-[14px] font-inter">
                    Binus Kemanggisan{" "}
                  </Text>
                  <Image
                    source={require("@/assets/utils/arrow-down.png")}
                    className="w-[16px] h-[16px]"
                  ></Image>
                </View>
              </View>
              <View>
                <Image
                  source={require("@/assets/utils/notifications.png")}
                  className="w-[40px] h-[40px]"
                ></Image>
              </View>
            </View>

            {/* Search and Filter*/}
            <View className="flex-row items-center mt-4 gap-2 justify-between">
              {/* SearchBar */}
              <View className="flex-1">
                <TouchableOpacity
                  onPress={() => router.push("/myroom/detailroom/searchRoom")}
                >
                  <SearchBar
                    placeholder="Search Activity"
                    onChangeText={(text) => console.log(text)}
                  />
                </TouchableOpacity>
              </View>
              {/* Filtering */}
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="border border-neutral-300 p-2 w-[80px] h-[44px] items-center justify-center rounded-[8px]"
              >
                <Image
                  source={require("@/assets/utils/setting-icon.png")}
                  className="w-[16px] h-[16px]"
                />
              </TouchableOpacity>
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
                  icon={require("@/assets/utils/passive-icon/globe.png")}
                  activeIcon={require("@/assets/utils/active-icon/globe.png")}
                  active={activeTab === "all"}
                  onPress={() => setActiveTab("all")}
                />
                <TabButton
                  title="Sport"
                  icon={require("@/assets/utils/passive-icon/running.png")}
                  activeIcon={require("@/assets/utils/active-icon/running.png")}
                  active={activeTab === "sport"}
                  onPress={() => setActiveTab("sport")}
                />
                <TabButton
                  title="Hangout"
                  icon={require("@/assets/utils/passive-icon/hangout.png")}
                  activeIcon={require("@/assets/utils/active-icon/hangout.png")}
                  active={activeTab === "hangout"}
                  onPress={() => setActiveTab("hangout")}
                />
                <TabButton
                  title="Learning"
                  icon={require("@/assets/utils/passive-icon/learning.png")}
                  activeIcon={require("@/assets/utils/active-icon/learning.png")}
                  active={activeTab === "learning"}
                  onPress={() => setActiveTab("learning")}
                />
                <TabButton
                  title="Events"
                  icon={require("@/assets/utils/passive-icon/events.png")}
                  activeIcon={require("@/assets/utils/active-icon/events.png")}
                  active={activeTab === "events"}
                  onPress={() => setActiveTab("events")}
                />
                <TabButton
                  title="Hobby"
                  icon={require("@/assets/utils/passive-icon/hobby.png")}
                  activeIcon={require("@/assets/utils/active-icon/hobby.png")}
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
          className="w-100% bg-neutral-500 px-[13px] pt-[15px] pb-[15px]"
          style={{ backgroundColor: COLORS.neutral100 }}
        >
          {/* Card */}
          <View className="gap-4">
            {events.map((event) => (
              <CardRoom key={event.id} {...event} />
            ))}
          </View>
        </View>
      </ScrollView>
      <ModalFilteringDynamic
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        filters={[
          {
            title: "Sort By",
            options: [
              "Earliest Time",
              "Nearest Location",
              "Most Popular",
              "Recently Added",
            ],
          },
          { title: "Price", options: ["Free", "Paid"] },
          { title: "Event Type", options: ["Online", "Onsite"] },
        ]}
      />
    </SafeAreaView>
  );
}
