import { ProfileTopBar } from "@/components/profile/ProfileTopBar";
import { COLORS } from "@/constants/utils/colors";
import { mockProfile } from "@/dummy/profileData";
import React from "react";
import { View } from "react-native";

export default function MyProfileScreen() {
  const currentUser = mockProfile;

  return (
    <View className="flex-1" style={{ backgroundColor: COLORS.white }}>
      {/* Top Bar with Back, Share, Menu */}
      <ProfileTopBar
        isOwnProfile={true}
        userId={currentUser.id}
        userName={currentUser.name}
      />

      {/* Scrollable Content */}

    </View>
  );
}
