// components/profile/FollowListItem.tsx
import { COLORS } from "@/constants/utils/colors";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export type FollowUser = {
  id: string;
  name: string;
  username: string;
  avatarUrl?: string;
  isFollowing: boolean;
  isMe?: boolean;
};

interface FollowListItemProps {
  user: FollowUser;
  onFollowToggle: (userId: string, currentlyFollowing: boolean) => void;
  onMessage: (userId: string) => void;
}

export const FollowListItem: React.FC<FollowListItemProps> = ({
  user,
  onFollowToggle,
  onMessage,
}) => {
  const handleProfilePress = () => {
    if (user.isMe) {
      router.push("/profile");
    } else {
      router.push(`/profile/${user.id}`);
    }
  };

  return (
    <View className="flex-row items-center justify-between py-3">
      {/* User Info */}
      <TouchableOpacity
        onPress={handleProfilePress}
        className="flex-row items-center gap-3 flex-1"
        activeOpacity={0.7}
      >
        {/* Avatar */}
        <View className="w-12 h-12 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.primary2nd }}>
          {user.avatarUrl ? (
            <Image
              source={{ uri: user.avatarUrl }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Text className="text-lg font-semibold text-white">
                {user.name.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Name & Username */}
        <View className="flex-1">
          <Text
            className="text-sm font-medium"
            numberOfLines={1}
            style={{ color: COLORS.neutral900 }}
          >
            {user.name}
          </Text>
          <Text
            className="text-xs"
            numberOfLines={1}
            style={{ color: COLORS.neutral500 }}
          >
            @{user.username}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Action Buttons */}
      {!user.isMe && (
        <View className="flex-row gap-2">
          {user.isFollowing ? (
            // Following state: [Following (yellow)] [X (no bg)]
            <>
              <TouchableOpacity
                onPress={() => onMessage(user.id)}
                className="px-4 py-2 rounded-lg"
                style={{ backgroundColor: COLORS.primary2nd }}
              >
                <Text className="text-sm font-medium text-white">
                  Following
                </Text>
              </TouchableOpacity>

              {/* X button - no background */}
              <TouchableOpacity
                onPress={() => onFollowToggle(user.id, user.isFollowing)}
                className="w-9 h-9 items-center justify-center"
              >
                <Text className="text-xl" style={{ color: COLORS.neutral500 }}>
                  ✕
                </Text>
              </TouchableOpacity>
            </>
          ) : (
            // Not following state: [Follow (yellow)] only
            <TouchableOpacity
              onPress={() => onFollowToggle(user.id, user.isFollowing)}
              className="px-4 py-2 rounded-lg"
              style={{ backgroundColor: COLORS.primary2nd }}
            >
              <Text className="text-sm font-medium text-white">
                Follow
              </Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};