import { COLORS } from "@/constants/utils/colors";
import { RelationshipState, UserProfile } from "@/types/profile/profile";
import { router } from "expo-router";
import React, { memo, useMemo } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const toImageSource = (src: any) => {
  if (!src) return undefined;
  return typeof src === "string" ? { uri: src } : src;
};

const deriveRelation = (user: UserProfile): RelationshipState => {
  if (user.isMe) return "owner";
  if (user.relationship?.isFollowing) return "following";
  return "not_following";
};

type Props = {
  user: UserProfile;
  onPressEdit?: () => void;
  onPressFollow?: (following: boolean) => void;
  onPressMessage?: () => void;
  onPressFollowers?: () => void;
  onPressFollowing?: () => void;
  isUpdatingFollow?: boolean;
};

export const ProfileHeader: React.FC<Props> = memo(
  ({
    user,
    onPressEdit,
    onPressFollow,
    onPressMessage,
    isUpdatingFollow = false,
  }) => {
    const relation = useMemo(() => deriveRelation(user), [user]);
    const isFollowing = user.relationship?.isFollowing;

    return (
      <View className="items-center px-6 pt-6 pb-5">
        <Image
		 key={user.avatarUrl}
          source={
            toImageSource(user.avatarUrl) ??
            require("@/assets/profile/empty-profile.jpg")
          }
          className="w-24 h-24 rounded-full mb-3 bg-neutral-200"
        />

        <Text
          className="text-[20px] font-semibold"
          style={{ color: COLORS.neutral900 }}
        >
          {user.name}
        </Text>
        <Text className="text-[13px] mb-3" style={{ color: COLORS.neutral500 }}>
          @{user.username}
        </Text>

        <View className="flex-row items-center gap-8 mb-3">
          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "profile/follow/[userId]",
                params: {
                  userId: user.id,
                  initialTab: "following",
                },
              })
            }
            className="items-center"
          >
            <Text className="text-[16px] font-semibold">
              {user.followStats.following}
            </Text>
            <Text className="text-[12px]">Following</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              router.push({
                pathname: "profile/follow/[userId]",
                params: {
                  userId: user.id,
                  initialTab: "followers",
                },
              })
            }
            className="items-center"
          >
            <Text className="text-[16px] font-semibold">
              {user.followStats.followers}
            </Text>
            <Text className="text-[12px]">Followers</Text>
          </TouchableOpacity>
        </View>

        {!!(user.tagline || user.bio) && (
          <View className="mb-3 w-full">
            {user.bio ? (
              <Text
                className="text-center text-[12px]"
                numberOfLines={3}
                style={{ color: COLORS.neutral500 }}
              >
                {user.bio}
              </Text>
            ) : null}
          </View>
        )}

        {relation === "owner" ? (
          <View className="flex flex-row gap-2">
            <TouchableOpacity
              onPress={onPressEdit}
              className="px-4 py-2 rounded-[10px] bg-primary2nd"
              style={{ borderColor: COLORS.primary }}
            >
              <Text className="text-[14px] " style={{ color: COLORS.white }}>
                Detail Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/yourroom/yourRoom")}
              className="px-4 py-2 rounded-[10px] border"
              style={{
                borderColor: COLORS.primary,
                backgroundColor: COLORS.white,
              }}
            >
              <Text className="text-[14px]" style={{ color: COLORS.primary }}>
                Your Room
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => onPressFollow?.(!!isFollowing)}
              disabled={isUpdatingFollow}
              className={`px-4 py-2 rounded-[10px] ${
                isFollowing ? "bg-neutral-100 border" : "bg-primary2nd"
              }`}
              style={{
                borderColor: isFollowing ? COLORS.neutral300 : "transparent",
              }}
            >
              {isUpdatingFollow ? (
                <ActivityIndicator
                  size="small"
                  color={isFollowing ? COLORS.neutral900 : COLORS.white}
                />
              ) : (
                <Text
                  className="text-[14px]"
                  style={{
                    color: isFollowing ? COLORS.neutral900 : COLORS.white,
                  }}
                >
                  {isFollowing ? "Following" : "Follow"}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={
                onPressMessage ??
                (() => router.push("/directmessage/dm-homepage"))
              }
              className="px-4 py-2 rounded-[10px] border"
              style={{
                borderColor: COLORS.neutral300,
                backgroundColor: COLORS.white,
              }}
            >
              <Text
                className="text-[14px]"
                style={{ color: COLORS.neutral900 }}
              >
                Message
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
);

ProfileHeader.displayName = "ProfileHeader";
export default ProfileHeader;
