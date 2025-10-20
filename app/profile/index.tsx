<<<<<<< HEAD
import ProfileActivity from "@/components/profile/ProfileActivity";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStat } from "@/components/profile/ProfileStats";
=======
import { ProfileForm } from "@/components/profile/ProfileForm";
>>>>>>> 341d943786f3674699586898429701f88e3b1ef9
import { ProfileTopBar } from "@/components/profile/ProfileTopBar";
import { StudentInformationForm } from "@/components/profile/StudentInformationForm";
import { COLORS } from "@/constants/utils/colors";
import { mockProfile } from "@/dummy/profileData";
<<<<<<< HEAD
import React from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
=======
import React, { useState } from "react";
import { Alert, View } from "react-native";

type Mode = "view" | "edit_profile" | "personal_info";
>>>>>>> 341d943786f3674699586898429701f88e3b1ef9

export default function MyProfileScreen() {
  const user = mockProfile;
  const [mode, setMode] = useState<Mode>("view"); 

  const isEditing = mode === "edit_profile" || mode === "personal_info";

  const getTitle = () => {
    if (mode === 'edit_profile') return 'Edit Profile';
    if (mode === 'personal_info') return 'Personal Information';
    return undefined;
  };

  return (
<<<<<<< HEAD
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
=======
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
>>>>>>> 341d943786f3674699586898429701f88e3b1ef9
      <ProfileTopBar
        isOwnProfile
        userId={user.id}
        userName={user.name}
        title={getTitle()}
        showMenu={!isEditing}
        showShare={!isEditing}
        onBack={isEditing ? () => setMode("view") : undefined}
        
        onMenuNavigate={(key) => {
          if (key === "edit") {
            setMode("edit_profile");
          } 
          else if (key === "personal") {
            setMode("personal_info");
          }
          else if (key === "logout") {
            Alert.alert("Logout", "Mock");
          }
        }}
      />

<<<<<<< HEAD
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
=======
      <View style={{ flex: 1, minHeight: 0 }}>
        {mode === 'view' && (
          <View style={{ flex: 1, backgroundColor: COLORS.white }} />
        )}

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

        {mode === 'personal_info' && (
          <StudentInformationForm
            initial={{
              universityName: "Bina Nusantara University",
              major: "Computer Science",
              studentId: "2702336478",
              enrollmentYear: "2023",
              graduationYear: "2027",
              studentIdCard: null, /* Sementara */
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
    </View>
>>>>>>> 341d943786f3674699586898429701f88e3b1ef9
  );
}