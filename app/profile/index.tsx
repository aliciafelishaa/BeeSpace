import ProfileActivity from "@/components/profile/ProfileActivity";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStat } from "@/components/profile/ProfileStats";
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

     <ProfileHeader user={currentUser} />

     <ProfileStat
        stats={currentUser.stats}
            onPressItem={(key) => console.log("tap", key)} // optional
        />

    <ProfileActivity limit={3} />

    </View>
  );
}
