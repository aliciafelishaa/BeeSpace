// components/profile/ProfileHeader.tsx
import { COLORS } from "@/constants/utils/colors";
import { RelationshipState, UserProfile } from "@/types/profile/profile";
import { router } from "expo-router";
import React, { memo, useMemo } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

// Helper: avatar any → RN source
const toImageSource = (src: any) => {
  if (!src) return undefined;
  return typeof src === "string" ? { uri: src } : src;
};

// Helper: user relation
const deriveRelation = (user: UserProfile): RelationshipState => {
  if (user.isMe) return "owner";
  if (user.relationship?.isFollowing) return "following";
  return "not_following";
};

type Props = {
  user: UserProfile;
  onPressEdit?: () => void;
  onPressFollow?: (following: boolean) => void; // current state passed
  onPressMessage?: () => void;
  onPressFollowers?: () => void;
  onPressFollowing?: () => void;
};

export const ProfileHeader: React.FC<Props> = memo(
  ({
    user,
    onPressEdit,
    onPressFollow,
    onPressMessage,
    onPressFollowers,
    onPressFollowing,
  }) => {
    const relation = useMemo(() => deriveRelation(user), [user]);

    return (
      <View className="items-center px-6 pt-6 pb-5">
        {/* Avatar */}
        <Image
          source={
            toImageSource(user.avatarUrl) ??
            require("@/assets/profile/empty-profile.jpg")
          }
          className="w-24 h-24 rounded-full mb-3 bg-neutral-200"
        />

        {/* Name & username */}
        <Text className="text-[20px] font-semibold" style={{ color: COLORS.neutral900 }}>
          {user.name}
        </Text>
        <Text className="text-[13px] mb-3" style={{ color: COLORS.neutral500 }}>
          @{user.username}
        </Text>

        {/* Counts: Following | Followers */}
        <View className="flex-row items-center gap-8 mb-3">
          <TouchableOpacity
            onPress={
              onPressFollowing ?? (() => router.push("/profile/following"))
            }
            accessibilityLabel="Following"
            className="items-center"
          >
            <Text className="text-[16px] font-semibold" style={{ color: COLORS.neutral900 }}>
              {user.followStats.following}
            </Text>
            <Text className="text-[12px]" style={{ color: COLORS.neutral500 }}>
              Following
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onPressFollowers ?? (() => router.push("/profile/followers"))}
            accessibilityLabel="Followers"
            className="items-center"
          >
            <Text className="text-[16px] font-semibold" style={{ color: COLORS.neutral900 }}>
              {user.followStats.followers}
            </Text>
            <Text className="text-[12px]" style={{ color: COLORS.neutral500 }}>
              Followers
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bio / Tagline */}
        {!!(user.tagline || user.bio) && (
          <View className="mb-3 w-full">
            {user.tagline ? (
              <Text
                className="text-center text-[13px] mb-1"
                numberOfLines={2}
                style={{ color: COLORS.neutral700 }}
              >
                {user.tagline}
              </Text>
            ) : null}
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

        {/* Actions */}
        {relation === "owner" ? (
          <TouchableOpacity
            onPress={onPressEdit ?? (() => router.push("/profile/edit"))}
            className="px-4 py-2 rounded-[10px] border"
            style={{ borderColor: COLORS.primary, backgroundColor: COLORS.white }}
          >
            <Text className="text-[14px]" style={{ color: COLORS.primary }}>
              Edit Profile
            </Text>
          </TouchableOpacity>
        ) : (
          <View className="flex-row items-center gap-3">
            <TouchableOpacity
              onPress={() => onPressFollow?.(!!user.relationship?.isFollowing)}
              className={`px-4 py-2 rounded-[10px] ${
                user.relationship?.isFollowing
                  ? "bg-neutral-100 border"
                  : "bg-primary2nd"
              }`}
              style={{
                borderColor: user.relationship?.isFollowing
                  ? COLORS.neutral300
                  : "transparent",
              }}
            >
              <Text
                className="text-[14px]"
                style={{
                  color: user.relationship?.isFollowing
                    ? COLORS.neutral900
                    : COLORS.white,
                }}
              >
                {user.relationship?.isFollowing ? "Following" : "Follow"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onPressMessage ?? (() => router.push("/messages/new"))}
              className="px-4 py-2 rounded-[10px] border"
              style={{ borderColor: COLORS.neutral300, backgroundColor: COLORS.white }}
            >
              <Text className="text-[14px]" style={{ color: COLORS.neutral900 }}>
                Message
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  }
);

export default ProfileHeader;
