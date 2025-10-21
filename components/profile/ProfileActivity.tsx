// components/profile/ProfileActivity.tsx
import CardRoom from "@/components/myroom/CardRoom";
import EmptyState from "@/components/myroom/EmptyState";
import { COLORS } from "@/constants/utils/colors";
import { useRoom } from "@/hooks/useRoom";
import { RoomEntry } from "@/types/myroom/room";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  title?: string;
  limit?: number; 
};

const isUpcoming = (dateStr: string | Date) => {
  const d = dateStr instanceof Date ? dateStr : new Date(dateStr);
  const today = new Date();
  // nolkan jam agar perbandingan by date
  today.setHours(0, 0, 0, 0);
  const dd = new Date(d);
  dd.setHours(0, 0, 0, 0);
  return dd >= today;
};

export const ProfileActivity: React.FC<Props> = ({
  title = "Upcoming Activity",
  limit = 3,
}) => {
  const insets = useSafeAreaInsets();
  const { getRoom } = useRoom();

  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<RoomEntry[]>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const res = await getRoom();
      if (mounted) {
        setRooms(res.success && res.data ? res.data : []);
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const upcoming = useMemo(() => {
    const list = rooms
      .filter((r) => !!r.date && isUpcoming(r.date))
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    return list.slice(0, Math.max(0, limit));
  }, [rooms, limit]);

  return (
    <View
      className="px-6 pt-4 pb-6"
      style={{ paddingBottom: (insets?.bottom ?? 0) + 12 }}
    >
      {/* Section title */}
      <Text className="text-[16px] font-semibold mb-3" style={{ color: COLORS.neutral900 }}>
        {title}
      </Text>

      {/* Content */}
      {loading ? (
        <View className="py-8 items-center">
          <ActivityIndicator />
          <Text className="mt-2 text-[12px]" style={{ color: COLORS.neutral500 }}>
            Loading rooms...
          </Text>
        </View>
      ) : upcoming.length > 0 ? (
        <View className="gap-4">
          {upcoming.map((room) => (
            <CardRoom
              key={room.id ?? room.fromUid}
              id={room.id}
              title={room.planName}
              date={new Date(room.date)}
              location={room.place}
              slotRemaining={room.minMember}
              slotTotal={room.maxMember}
              hostName={room.fromUid ? room.fromUid : "Unknown"}
              imageSource={room.cover ? { uri: room.cover } : false}
              isEdit={false}
            />
          ))}
        </View>
      ) : (
        <View className="items-center mt-2">
          <EmptyState variant="upcoming" width={90} height={60} />
        </View>
      )}
    </View>
  );
};

export default ProfileActivity;
