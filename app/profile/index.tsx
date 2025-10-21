import { ProfileActivity } from "@/components/profile/ProfileActivity";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStat } from "@/components/profile/ProfileStats";
import { ProfileTopBar } from "@/components/profile/ProfileTopBar";
import { StudentInformationForm } from "@/components/profile/StudentInformationForm";
import { COLORS } from "@/constants/utils/colors";
import { mockProfile } from "@/dummy/profileData";
import { router } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Mode = "view" | "edit_profile" | "personal_info";

export default function MyProfileScreen() {
  const user = mockProfile;
  const [mode, setMode] = useState<Mode>("view"); 

  const isEditing = mode === "edit_profile" || mode === "personal_info";

  const changeMode = (newMode: Mode) => {
    setMode(newMode);
    
    const isEditing = newMode === "edit_profile" || newMode === "personal_info";
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('profileEditChange', { 
      detail: { editing: isEditing } 
    }));
  };

  const getTitle = () => {
    if (mode === 'edit_profile') return 'Edit Profile';
    if (mode === 'personal_info') return 'Personal Information';
    return undefined;
  };

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
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
        {/* Top Bar with Back, Share, Menu */}
        <ProfileTopBar
          isOwnProfile
          userId={user.id}
          userName={user.name}
          title={getTitle()}
          showMenu={!isEditing}
          showShare={!isEditing}
          onBack={isEditing ? () => changeMode("view") : undefined}
          onMenuNavigate={(key) => {
            if (key === "edit") {
              changeMode("edit_profile");
            } 
            else if (key === "personal") {
              changeMode("personal_info");
            }
            else if (key === "logout") {
              Alert.alert("Logout", "Mock");
            }
          }}
        />

        {/* View Mode - Show Profile */}
        {mode === 'view' && (
          <ScrollView 
            className="flex-1"
            showsVerticalScrollIndicator={false}
          >
            <ProfileHeader 
              user={user}
              onPressEdit={() => changeMode("edit_profile")}
              />

            <ProfileStat
              stats={user.stats}
              onPressItem={(key) => {
                router.push({
                  pathname: 'profile/follow/[userId]',
                  params: {
                    userId: user.id,
                    initialTab: key // 'followers' or 'following'
                  }
                });
              }}
            />

            <ProfileActivity limit={3} />
          </ScrollView>
        )}

        {/* Edit Profile Mode */}
        {mode === 'edit_profile' && (
          <ProfileForm
            initial={{
              avatar: user.avatarUrl as any,
              username: user.username ?? "",
              firstName: user.name?.split(" ")[0] ?? "",
              lastName: user.name?.split(" ").slice(1).join(" ") ?? "",
              email: "tasya.pndya@gmail.com",
              bio: user.bio ?? "",
            }}
            onPickImage={() => {
              console.log("Ini buat edit");
              alert("Tombol pensilnya udah di klik omg");
            }}
            onSave={(payload) => {
              console.log("SAVE PROFILE:", payload);
              Alert.alert("Saved (mock)", "Check console");
              setMode("view");
            }}
            onCancel={() => setMode("view")}
          />
        )}

        {/* Personal Info Mode */}
        {mode === 'personal_info' && (
          <StudentInformationForm
            initial={{
              universityName: "Bina Nusantara University",
              major: "Computer Science",
              studentId: "2702336478",
              enrollmentYear: "2023",
              graduationYear: "2027",
              studentIdCard: null,
            }}
            onSave={(payload) => {
              console.log("SAVE PERSONAL INFO:", payload);
              Alert.alert("Saved (mock)", "Check console");
              setMode("view");
            }}
            onCancel={() => setMode("view")}
          />
        )}
      </View>
    </SafeAreaView>

  );
}