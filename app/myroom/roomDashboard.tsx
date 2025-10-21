import TabButton from "@/assets/utils/myroom/TabButton";
import TimeButton from "@/assets/utils/myroom/TimeButton";
import CardRoom from "@/components/myroom/CardRoom";
import ModalFilteringDynamic from "@/components/utils/ModalFiltering";
import SearchBar from "@/components/utils/SearchBar";
import { COLORS } from "@/constants/utils/colors";
import { useAuthState } from "@/hooks/useAuthState";
import { useRoom } from "@/hooks/useRoom";
import { getUserById } from "@/services/userService";
import { RoomCategory, TimeCategory } from "@/types/myroom/myroom";
import { RoomEntry } from "@/types/myroom/room";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
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
  const [rooms, setRooms] = useState<RoomEntry[]>([]);
  const { getRoom } = useRoom();
  const [loading, setLoading] = useState(false);
  const { user } = useAuthState();
  const { uid: paramUid } = useLocalSearchParams();
  const uid = paramUid || user?.uid;
  const [filteredRooms, setFilteredRooms] = useState<RoomEntry[]>([]);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const fetchRoom = async () => {
      if (!uid) return;
      setLoading(true);
      const res = await getRoom(uid);

      if (res.success && res.data) {
        const roomsData = res.data;
        const roomsWithHost = await Promise.all(
          roomsData.map(async (room: RoomEntry) => {
            console.log(room.fromUid);
            const userRes = await getUserById(room.fromUid);
            return {
              ...room,
              hostName: userRes?.name || "Unknown",
              avatar: userRes?.avatar || "",
            };
          })
        );

        setRooms(roomsWithHost);
      } else {
        setRooms([]);
      }
      setLoading(false);
    };
    fetchRoom();
  }, [uid]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!uid) return;
      const userRes = await getUserById(uid);
      setUserData(userRes);
    };
    fetchUserData();
  }, [uid]);

  useEffect(() => {
    const applyFilter = async () => {
      const now = new Date();

      const filtered = await Promise.all(
        rooms.map(async (room) => {
          const roomDate = new Date(room.date);

          // --- filter kategori ---
          if (activeTab !== "all" && room.category !== activeTab) {
            return null;
          }

          // --- filter waktu ---
          if (activeFilter === "today") {
            const isToday =
              roomDate.getDate() === now.getDate() &&
              roomDate.getMonth() === now.getMonth() &&
              roomDate.getFullYear() === now.getFullYear();
            if (!isToday) return null;
          }

          if (activeFilter === "thisweek") {
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 7);

            const isThisWeek = roomDate >= startOfWeek && roomDate <= endOfWeek;
            if (!isThisWeek) return null;
          }

          if (activeFilter === "thismonth") {
            const isThisMonth =
              roomDate.getMonth() === now.getMonth() &&
              roomDate.getFullYear() === now.getFullYear();
            if (!isThisMonth) return null;
          }
          if (activeFilter === "mycampus") {
            if (!userData?.university) return null;
            const sameCampus =
              room.place
                ?.toLowerCase()
                .includes(userData.university.toLowerCase()) ||
              userData.university
                .toLowerCase()
                .includes(room.place?.toLowerCase());
            if (!sameCampus) return null;
          }

          return room;
        })
      );

      // hapus nilai null dari hasil filter
      setFilteredRooms(filtered.filter((r) => r !== null) as RoomEntry[]);
    };

    applyFilter();
  }, [rooms, activeTab, activeFilter, userData]);

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
                <Text className="text-neutral-500 text-[12px] font-interRegular">
                  Activities Near
                </Text>
                <View className="flex-row gap-2 items-center">
                  <Image
                    source={require("@/assets/utils/map.png")}
                    className="w-[16px] h-[16px]"
                  ></Image>
                  <Text className="text-neutral-700  text-[14px] font-interSemiBold">
                    Binus Kemanggisan{" "}
                  </Text>
                  <Image
                    source={require("@/assets/utils/arrow-down.png")}
                    className="w-[16px] h-[16px]"
                  ></Image>
                </View>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => router.push("/notifications/notification")}
                >
                  <Image
                    source={require("@/assets/utils/notifications.png")}
                    className="w-[40px] h-[40px]"
                  />
                </TouchableOpacity>
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
            {loading ? (
              <Text className="text-center text-neutral-500">
                Loading rooms...
              </Text>
            ) : filteredRooms.length > 0 ? (
              filteredRooms.map((room) => (
                <CardRoom
                  key={room.id}
                  id={room.id}
                  title={room.planName}
                  date={new Date(room.date)}
                  location={room.place}
                  slotRemaining={room.minMember}
                  timeStart={room.timeStart}
                  timeEnd={room.timeEnd}
                  slotTotal={room.maxMember}
                  hostName={room.hostName || "Anonymous"}
                  imageSource={room.cover ? { uri: room.cover } : false}
                  isEdit={false}
                  imageAvatar={room.imageAvatar}
                />
              ))
            ) : (
              <Text className="text-center text-neutral-500">
                No rooms found
              </Text>
            )}
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
