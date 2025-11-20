import CardRoom from "@/components/myroom/CardRoom";
import EmptyState from "@/components/myroom/EmptyState";
import { useAuthState } from "@/hooks/useAuthState";
import { useRoom } from "@/hooks/useRoom";
import { getUserById } from "@/services/userService";
import { SectionTab } from "@/types/myroom/myroom";
import { RoomEntry } from "@/types/myroom/room";
import { useLocalSearchParams, usePathname } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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

  const initialFromPath: SectionTab | undefined = (() => {
    if (pathname.endsWith("/upcoming")) return "upcoming";
    if (pathname.endsWith("/hosted")) return "hosted";
    if (pathname.endsWith("/history")) return "history";
    return undefined;
  })();

  const [section, setSection] = useState<SectionTab>(
    initialFromPath ?? initialSection
  );
  const [rooms, setRooms] = useState<RoomEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const { getRoom } = useRoom();
  const { user } = useAuthState();
  const { uid: paramUid } = useLocalSearchParams();
  const uid = paramUid || user?.uid;

  // Fetch rooms
  useEffect(() => {
    if (!uid) {
      console.warn("UID not found. User not logged in or invalid param.");
      return;
    }

    const fetchRoom = async () => {
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

  // Filter rooms berdasarkan section
  const filteredRooms = useMemo(() => {
    const now = new Date();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Helper: mengubah room menjadi Date Start lengkap
    const getRoomStart = (room: any) => {
      const roomDate = new Date(room.date);
      const [h, m] = (room.timeStart ?? "00:00").split(":");
      roomDate.setHours(Number(h), Number(m), 0, 0);
      return roomDate;
    };

    const baseRooms = rooms.filter(
      (room) => room.fromUid === uid || room.joinedUids?.includes(uid)
    );

    let result = baseRooms.filter((room) => {
      const roomDate = new Date(room.date);
      const roomStart = getRoomStart(room);

      // UPCOMING
      if (section === "upcoming") {
        if (roomDate > today) return true;

        if (
          roomDate.toDateString() === now.toDateString() &&
          roomStart >= now
        ) {
          return true;
        }

        return false;
      }
      // HOSTED
      if (section === "hosted") {
        return room.fromUid === uid;
      }
      // HISTORY
      if (section === "history") {
        return getRoomStart(room) < now;
      }

      return true;
    });

    result.sort((a, b) => {
      const aStart = getRoomStart(a).getTime();
      const bStart = getRoomStart(b).getTime();
      return aStart - bStart;
    });

    return result;
  }, [rooms, section, uid]);

  return (
    <SafeAreaView
      className="bg-neutral-100"
      style={{
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
        {/* Header */}
        <View className="px-[16px]">
          <Text className="text-[20px] font-bold py-5 text-neutral-900 font-inter">
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
        {loading ? (
          <Text className="text-center text-neutral-500 mt-4">
            Loading rooms...
          </Text>
        ) : filteredRooms.length > 0 ? (
          <View className="px-[13px] pt-[15px] pb-[15px] gap-4">
            {filteredRooms.map((room) => (
              <CardRoom
                key={room.id}
                id={room.id}
                title={room.planName}
                date={new Date(room.date)}
                location={room.place}
                joinedUids={room.joinedUids || []}
                timeStart={room.timeStart}
                timeEnd={room.timeEnd}
                slotTotal={room.maxMember}
                hostName={room.hostName || "Anonymous"}
                imageSource={room.cover ? { uri: room.cover } : false}
                isEdit={false}
                imageAvatar={room.imageAvatar}
                hostUid={room.fromUid}
                currentUserId={uid || ""}
              />
            ))}
          </View>
        ) : (
          <View className="flex-1 justify-center items-center mt-8">
            <EmptyState variant={section} width={90} height={60} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
