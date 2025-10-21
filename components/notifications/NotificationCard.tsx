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


const IconForType = ({ type, showDot }: { type: NotificationType; showDot: boolean }) => {
  let iconSource: any;
  switch (type) {
    case "new_message":
      iconSource = require("@/assets/notifications/icon-message.png");
      break;
    case "plan_created":
      iconSource = require("@/assets/notifications/icon-inbox.png");
      break;
    case "plan_start":
    case "plan_cancelled":
      iconSource = require("@/assets/notifications/icon-time.png");
      break;
    default:
      iconSource = require("@/assets/notifications/icon-inbox.png");
  }


  const PRIMARY_DOT =
    (COLORS as any).primary2nd || (COLORS as any).primary || "#FACC15"; // ~amber-400

  return (
  <View className="w-5 h-5 relative items-center justify-center">
    <Image 
      source={iconSource} 
      className="w-1 h-1"
      resizeMode="contain"
    />
    {showDot && (
      <View 
        className="absolute w-2 h-2 rounded-full border border-white"
        style={{
          right: -2,
          top: -2,
          backgroundColor: PRIMARY_DOT,
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
  const bgColor = item.read ? COLORS.neutral100 : COLORS.white; 
  const formattedTime = formatTimeLabel(item.timestamp);

  return (
    <View
      className="w-full rounded-lg border border-gray-300"
      style={{
        backgroundColor: bgColor,
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
          <Text className="text-xs text-neutral-500 ml-3">{formattedTime}</Text>
        </View>

        {/* Body */}
        {!!item.body && (
          <Text className="mt-1.5 text-[13px] leading-5 text-neutral-700" numberOfLines={2}>
            {item.body}
          </Text>
        )}

        {/* Action */}
        {!item.read && onMarkRead && (
          <TouchableOpacity 
            onPress={() => onMarkRead(item.id)} 
            className="mt-2" 
            accessibilityRole="button"
          >
            <Text 
              className="text-[13px] font-medium"
              style={{ color: COLORS.error }}
            >
              Mark as read
            </Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    </View>
  );
};