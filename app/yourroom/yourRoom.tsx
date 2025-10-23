import CardRoom from "@/components/myroom/CardRoom";
import EmptyState from "@/components/myroom/EmptyState";
import { useAuthState } from "@/hooks/useAuthState";
import { useRoom } from "@/hooks/useRoom";
import { getUserById } from "@/services/userService";
import { SectionTab } from "@/types/myroom/myroom";
import { RoomEntry } from "@/types/myroom/room";
import { useLocalSearchParams, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const Segmented = ({
  value,
  options,
  onChange,
}: {
  value: SectionTab;
  options: { key: SectionTab; label: string }[];
  onChange: (v: SectionTab) => void;
}) => {
  return (
    <View className="mt-3 items-center">
      <View className="flex-row gap-8">
        {options.map((opt) => {
          const active = value === opt.key;
          return (
            <TouchableOpacity key={opt.key} onPress={() => onChange(opt.key)}>
              <View className="items-center">
                <Text
                  className={`text-[14px] ${active ? "text-amber-700 font-semibold" : "text-neutral-400"}`}
                >
                  {opt.label}
                </Text>
                <View
                  className={`h-[2px] w-14 mt-2 rounded ${active ? "bg-amber-500" : "bg-transparent"}`}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default function MyRoomDash({
  initialSection = "upcoming",
}: {
  initialSection?: SectionTab;
}) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();

  const initialFromPath: SectionTab | undefined = (():
    | SectionTab
    | undefined => {
    if (pathname.endsWith("/upcoming")) return "upcoming";
    if (pathname.endsWith("/hosted")) return "hosted";
    if (pathname.endsWith("/history")) return "history";
    return undefined;
  })();

  const [section, setSection] = useState<SectionTab>(
    initialFromPath ?? initialSection
  );

  const [rooms, setRooms] = useState<RoomEntry[]>([]);
  const { getRoom } = useRoom();
  const [loading, setLoading] = useState(false);
  const { user } = useAuthState();
  const { uid: paramUid } = useLocalSearchParams();
  const uid = paramUid || user?.uid;

  useEffect(() => {
    if (!uid) {
      console.warn("UID not found. User not logged in or invalid param.");
      return;
    }
    const fetchRoom = async () => {
      setLoading(true);
      const res = await getRoom(uid);
      console.log(res.data);
      if (res.success && res.data) {
        const roomsData = res.data;
        const roomsWithHost = await Promise.all(
          roomsData.map(async (room: RoomEntry) => {
            console.log(room.fromUid);
            const userRes = await getUserById(room.fromUid);
            return {
              ...room,
              hostName: userRes?.name || "Unknown",
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
    console.log(rooms);
  }, [uid]);

  return (
    <SafeAreaView
      className="bg-neutral-100"
      style={{ flex: 1, paddingBottom: insets.top }}
    >
      <ScrollView
        className=" px-[13px] pt-[35px]"
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-[16px]">
          <Text
            className="text-[20px] font-semibold py-3 text-neutral-900 font-inter
          "
          >
            Your Room
          </Text>

          {/* Segmented tabs */}
          <Segmented
            value={section}
            onChange={setSection}
            options={[
              { key: "upcoming", label: "Upcoming" },
              { key: "hosted", label: "Hosted" },
              { key: "history", label: "History" },
            ]}
          />
        </View>

        {/* Room list */}
        {rooms.length > 0 ? (
          <View className="px-[13px] pt-[15px] pb-[15px]">
            <View className="gap-4">
              {loading ? (
                <Text className="text-center text-neutral-500">
                  Loading rooms...
                </Text>
              ) : rooms.length > 0 ? (
                rooms.map((room) => (
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
        ) : (
          /*Empty state*/
          <View className="flex-1 justify-center items-center mt-8">
            <EmptyState variant={section} width={90} height={60} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
