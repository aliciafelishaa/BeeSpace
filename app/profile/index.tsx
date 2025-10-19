import ProfileActivity from "@/components/profile/ProfileActivity";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStat } from "@/components/profile/ProfileStats";
import { ProfileTopBar } from "@/components/profile/ProfileTopBar";
import { COLORS } from "@/constants/utils/colors";
import { mockProfile } from "@/dummy/profileData";
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyProfileScreen() {
  const currentUser = mockProfile;

  return (
    <SafeAreaView
      className="bg-neutral-100"
      style={{
        backgroundColor: COLORS.white,
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      {/* Top Bar with Back, Share, Menu */}
      <ProfileTopBar
        isOwnProfile={true}
        userId={currentUser.id}
        userName={currentUser.name}
      />

      {/* Scrollable Content */}
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader user={currentUser}/>

        <ProfileStat
          stats={currentUser.stats}
          onPressItem={(key) => console.log("tap", key)}
        />

        <ProfileActivity limit={3} />
      </ScrollView>
    </SafeAreaView>
  );
}