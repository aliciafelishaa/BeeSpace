import { COLORS } from "@/constants/utils/colors";
import { NotificationItem, NotificationType } from "@/types/notifications/notification";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

const formatTimeLabel = (d: Date) => {
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const time = isToday
    ? d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    : d.toLocaleDateString("id-ID", { day: "2-digit", month: "2-digit" });
  return isToday ? `${time} WIB` : time;
};

interface NotificationCardProps {
  item: NotificationItem;
  onSelectItem?: (item: NotificationItem) => void;
  onMarkRead?: (id: string) => void;
}

// Ikon: pakai PNG (ubah ke .svg component kalau sudah setup transformer)
const IconForType = ({ type, showDot }: { type: NotificationType; showDot: boolean }) => {
  let iconSource: any;
  switch (type) {
    case "new_message":
      iconSource = require("@/assets/notifications/icon-message.svg");
      break;
    case "plan_created":
      iconSource = require("@/assets/notifications/icon-inbox.svg");
      break;
    case "plan_start":
    case "plan_cancelled":
      iconSource = require("@/assets/notifications/icon-time.svg");
      break;
    default:
      iconSource = require("@/assets/notifications/icon-inbox.svg");
  }

  // Warna badge: pakai primary2nd kalau ada; fallback ke primary; terakhir hex aman
  const PRIMARY_DOT =
    (COLORS as any).primary2nd || (COLORS as any).primary || "#FACC15"; // ~amber-400

  return (
    <View style={{ width: 20, height: 20, position: "relative", alignItems: "center", justifyContent: "center" }}>
      <Image source={iconSource} style={{ width: 20, height: 20, resizeMode: "contain" }} />
      {showDot && (
        <View
          style={{
            position: "absolute",
            right: -2,
            top: -2,
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: PRIMARY_DOT,
            borderWidth: 1,
            borderColor: "#FFFFFF",
          }}
          accessibilityLabel="Unread badge"
        />
      )}
    </View>
  );
};

export const NotificationCard: React.FC<NotificationCardProps> = ({
  item,
  onSelectItem,
  onMarkRead,
}) => {
  const bgColor = item.read ? COLORS.neutral100 : COLORS.white; // ✅ beda background saat read
  const formattedTime = formatTimeLabel(item.timestamp);

  return (
    <View
      className="w-full rounded-lg"
      style={{
        backgroundColor: bgColor,
        borderWidth: 1,
        borderColor: "#D1D5DB", // samain dengan Search/Filter; kalau tim pakai token lain, ganti ke COLORS.neutral100
      }}
    >
      <TouchableOpacity
        onPress={() => onSelectItem?.(item)}
        activeOpacity={0.7}
        className="px-4 py-3"
        accessibilityRole="button"
        accessibilityLabel={item.title}
      >
        {/* Header */}
        <View className="flex-row items-start justify-between">
          <View className="flex-row items-center gap-2">
            {/* ✅ Dot kuning muncul hanya saat UNREAD */}
            <IconForType type={item.type} showDot={!item.read} />
            <Text
              className={`text-[15px] ${
                item.read ? "font-medium" : "font-semibold"
              } text-neutral-900`}
              numberOfLines={1}
            >
              {item.title}
            </Text>
          </View>
          <Text className="text-[12px] text-neutral-500 ml-3">{formattedTime}</Text>
        </View>

        {/* Body */}
        {!!item.body && (
          <Text className="mt-1.5 text-[13px] leading-5 text-neutral-700" numberOfLines={2}>
            {item.body}
          </Text>
        )}

        {/* Action */}
        {!item.read && onMarkRead && (
          <TouchableOpacity onPress={() => onMarkRead(item.id)} className="mt-2" accessibilityRole="button">
            <Text style={{ color: COLORS.error }} className="text-[13px] font-medium">
              Mark as read
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
};
