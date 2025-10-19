import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, Image, Share, TouchableOpacity, View } from "react-native";
import { ProfileMenuModal } from "./ProfileMenuModal";

interface ProfileTopBarProps {
  isOwnProfile: boolean;
  userId?: string;
  userName?: string;
}

export const ProfileTopBar: React.FC<ProfileTopBarProps> = ({
  isOwnProfile,
  userId,
  userName,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${userName ?? "this user"}'s profile on BeeSpace!`,
        url: userId ? `beespace://profile/${userId}` : undefined, // ready for deep link
      });
    } catch (error: any) {
      Alert.alert("Share failed", error.message || "Something went wrong.");
      console.error("Error sharing:", error);
    }
  };

  return (
    <>
      <View className="flex-row items-center justify-between px-4 mt-8">
        {/* ← Back Button */}
        <TouchableOpacity
          onPress={() => router.back()}
          accessibilityLabel="Back"
          className="w-10 h-10 items-center justify-center rounded-full active:opacity-70"
        >
          <Image
            source={require("@/assets/utils/arrow-left-back.png")}
            className="w-6 h-6"
            resizeMode="contain"
          />
        </TouchableOpacity>

        {/* → Right Actions */}
        <View className="flex-row gap-4">
          {/* Share Button */}
          <TouchableOpacity
            onPress={handleShare}
            accessibilityLabel="Share profile"
            className="w-10 h-10 items-center justify-center rounded-full active:opacity-70"
          >
            <Image
              source={require("@/assets/profile/icon-share.png")}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>

          {isOwnProfile && (
            <TouchableOpacity
              onPress={() => setMenuOpen(true)}
              accessibilityLabel="Open menu"
              className="w-10 h-10 items-center justify-center rounded-full active:opacity-70"
            >
              <Image
                source={require("@/assets/profile/icon-menu.png")}
                className="w-6 h-6"
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {isOwnProfile && (
        <ProfileMenuModal
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
        />
      )}
    </>
  );
};
