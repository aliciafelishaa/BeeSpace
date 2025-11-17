import { COLORS } from "@/constants/utils/colors";
import { ProfileStats } from "@/types/profile/profile";
import React, { memo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
  stats: ProfileStats;
  onPressItem?: (key: "rating" | "active" | "hosted" | "joined") => void;
};

const StatItem: React.FC<{
  label: string;
  value: string | number;
  onPress?: () => void;
  rightAddon?: React.ReactNode; 
}> = ({ label, value, onPress, rightAddon }) => {
  const Wrapper: any = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      onPress={onPress}
      className="flex-1 items-center"
      accessibilityLabel={label}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <Text
          className="text-[22px] font-semibold"
          style={{ color: COLORS.neutral900 }}
        >
          {value}
        </Text>
        {rightAddon ? <View className="ml-1">{rightAddon}</View> : null}
      </View>
      <Text className="text-[12px]" style={{ color: COLORS.neutral500 }}>
        {label}
      </Text>
    </Wrapper>
  );
};

export const ProfileStat: React.FC<Props> = memo(({ stats, onPressItem }) => {
  const ratingText =
    typeof stats.rating === "number" ? stats.rating.toFixed(1) : "—";

  return (
    <View className="px-6 py-5 border-t" style={{ borderColor: COLORS.neutral300 }}>
      {/* Title */}
      <Text
        className="text-[16px] font-semibold mb-3"
        style={{ color: COLORS.neutral900 }}
      >
        Statistic
      </Text>

      {/* Items */}
      <View className="flex-row items-start justify-between">
        {/* <StatItem
          label="Rating"
          value={ratingText}
          onPress={onPressItem ? () => onPressItem("rating") : undefined}
          rightAddon={
            <Image
              source={require("@/assets/profile/icon-star.png")} // ganti ke asetmu
              className="w-4 h-4"
              resizeMode="contain"
            />
          }
        /> */}
        <StatItem
          label="Active Room"
          value={stats.activeRooms}
          onPress={onPressItem ? () => onPressItem("active") : undefined}
        />
        <StatItem
          label="Hosted Room"
          value={stats.hostedRooms}
          onPress={onPressItem ? () => onPressItem("hosted") : undefined}
        />
        <StatItem
          label="Joined Room"
          value={stats.totalJoined}
          onPress={onPressItem ? () => onPressItem("joined") : undefined}
        />
      </View>
    </View>
  );
});

export default ProfileStat;
