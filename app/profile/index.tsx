import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileTopBar } from "@/components/profile/ProfileTopBar";
import { StudentInformationForm } from "@/components/profile/StudentInformationForm";
import { COLORS } from "@/constants/utils/colors";
import { mockProfile } from "@/dummy/profileData";
import React, { useState } from "react";
import { Alert, View } from "react-native";

type Mode = "view" | "edit_profile" | "personal_info";

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
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
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
  );
}