import TabButton from "@/assets/utils/myroom/TabButton";
import TimeButton from "@/assets/utils/myroom/TimeButton";
import CardRoom from "@/components/myroom/CardRoom";
import ModalFilteringDynamic from "@/components/utils/ModalFiltering";
import SearchBar from "@/components/utils/SearchBar";
import { COLORS } from "@/constants/utils/colors";
import { useAuthState } from "@/hooks/useAuthState";
import { useRoom } from "@/hooks/useRoom";
import { useUserData } from "@/hooks/useUserData";
import { getUserById } from "@/services/userService";
import { RoomCategory, TimeCategory } from "@/types/myroom/myroom";
import { RoomEntry } from "@/types/myroom/room";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  All,
  Sport,
  Transportation,
  Academic,
  Events,
  Hangout,
  Community,
  Wellness,
  Competition
} from "@/components/ui/IconCategory";
import { Notification, Map } from "@/components/ui/IconDash";

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
  const [userDatas, setUserDatas] = useState<any>(null);
  const [filteredRooms, setFilteredRooms] = useState<RoomEntry[]>([]);
  const [search, setSearch] = useState("");
  const { userData } = useUserData(uid);
  const [extraFilter, setExtraFilter] = useState<Record<string, string>>({});
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchRoom = async () => {
      if (!uid) return;
      setLoading(true);
      const res = await getRoom(uid);

      if (res.success && res.data) {
        const roomsData = res.data;

        const roomsWithHost = await Promise.all(
          roomsData.map(async (room: RoomEntry) => {
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
      setUserDatas(userRes);
    };
    fetchUserData();
  }, [uid]);

  useEffect(() => {
    if (!rooms) return;

    const now = new Date();

    let result = rooms.filter((room) => {
      const roomDate = new Date(room.date);

      // --- category ---
      if (activeTab !== "all" && room.category.toLowerCase() !== activeTab) {
        return false;
      }

      // --- time filters ---
      if (activeFilter === "today") {
        const isToday =
          roomDate.getDate() === now.getDate() &&
          roomDate.getMonth() === now.getMonth() &&
          roomDate.getFullYear() === now.getFullYear();

        if (!isToday) return false;
      }

      if (activeFilter === "thisweek") {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 7);

        const isThisWeek = roomDate >= startOfWeek && roomDate <= endOfWeek;
        if (!isThisWeek) return false;
      }

      if (activeFilter === "thismonth") {
        const isThisMonth =
          roomDate.getMonth() === now.getMonth() &&
          roomDate.getFullYear() === now.getFullYear();
        if (!isThisMonth) return false;
      }

      if (activeFilter === "mycampus") {
        if (!userData?.university) return false;
        if (!room.userUniv) return false;

        return (
          room.userUniv.toLowerCase() === userData.university.toLowerCase()
        );
      }

      // sorting
      if (search.trim() !== "") {
        const q = search.toLowerCase();
        const match =
          room.planName?.toLowerCase().includes(q) ||
          room.place?.toLowerCase().includes(q) ||
          room.hostName?.toLowerCase().includes(q);
        if (!match) return false;
      }

      // // --- EXTRA FILTER: Event Type ---
      // if (extraFilter["Event Type"] && extraFilter["Event Type"] !== "All") {
      //   const isOnline = extraFilter["Event Type"] === "Online";

      //   if (isOnline && room.place !== "online") return false;
      //   if (!isOnline && room.place !== "onsite") return false;
      // }

      return true;
    });

    // //Filtering
    // if (extraFilter["Sort By"] === "Descending") {
    //   result = result.sort(
    //     (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    //   );
    // }

    // // Sort berdasarkan event yang akan datang (waktu mulai paling dekat)
    // if (extraFilter["Sort By"] === "Ascending") {
    //   result = result.sort(
    //     (a, b) =>
    //       new Date(a.timeStart).getTime() - new Date(b.timeStart).getTime()
    //   );
    // }

    setFilteredRooms(result);
  }, [rooms, activeTab, activeFilter, userData, search, extraFilter]);

  useEffect(() => {
    if (!rooms || rooms.length === 0) return;

    const uniqueCategories = [
      "all",
      ...Array.from(new Set(rooms.map((r) => r.category.toLowerCase()))),
    ];

    setAvailableCategories(uniqueCategories);
  }, [rooms]);

  const categoryIcons: Record<string, React.FC<{ isActive?: boolean }>> = {
    all: All,
    sport: Sport,
    academic: Academic,
    events: Events,
    hangout: Hangout,
    community: Community,
    transportation: Transportation,
    wellness: Wellness,
    competition: Competition,
  };


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
                  My Campus
                </Text>
                <View className="flex-row gap-2 items-center">
                  <Map />
                  <Text className="text-neutral-700  text-[14px] font-interSemiBold">
                    {userData?.university || "-"}
                  </Text>
                </View>
              </View>
              <View>
                <TouchableOpacity
                  onPress={() => router.push("/notifications/notification")}
                >
                  <Notification/>
                </TouchableOpacity>
              </View>
            </View>

            {/* Search and Filter*/}
            <View className="flex-row items-center mt-4 gap-2 justify-between">
              {/* SearchBar */}
              <View className="flex-1">
                <SearchBar
                  placeholder="Search Activity"
                  value={search}
                  onSearch={setSearch}
                  onChangeText={(text) => setSearch(text)}
                />
              </View>

              {/* Filtering */}
              {/* <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className="border border-neutral-300 p-2 w-[80px] h-[44px] items-center justify-center rounded-[8px]"
              >
                <Image
                  source={require("@/assets/utils/setting-icon.png")}
                  className="w-[16px] h-[16px]"
                />
              </TouchableOpacity> */}
            </View>

            {/* Pilihan Category */}
            <View className="mt-4">
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8 }}
              >
                {availableCategories.map((cat) => {
                  const IconComponent = categoryIcons[cat] || All;

                  return (
                    <TabButton
                      title={cat.charAt(0).toUpperCase() + cat.slice(1)}
                      icon={<IconComponent isActive={false} />}
                      activeIcon={<IconComponent isActive={true} />}
                      active={activeTab === cat}
                      onPress={() => setActiveTab(cat as RoomCategory)}
                    />
                  );
                })}
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
                  timeStart={room.timeStart}
                  timeEnd={room.timeEnd}
                  slotTotal={room.maxMember}
                  hostName={room.hostName || "Anonymous"}
                  imageSource={room.cover ? { uri: room.cover } : false}
                  isEdit={false}
                  imageAvatar={room.imageAvatar}
                  hostUid={room.fromUid}
                  currentUserId={uid || ""}
                  joinedUids={room.joinedUids || []}
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
            options: ["Ascending", "Descending"],
          },
          { title: "Event Type", options: ["All", "Online", "Onsite"] },
        ]}
        onApply={(selected) => setExtraFilter(selected)}
      />
    </SafeAreaView>
  );
}
