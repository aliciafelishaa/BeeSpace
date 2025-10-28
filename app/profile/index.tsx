import { ProfileActivity } from "@/components/profile/ProfileActivity";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileStat } from "@/components/profile/ProfileStats";
import { ProfileTopBar } from "@/components/profile/ProfileTopBar";
import { StudentInformationForm } from "@/components/profile/StudentInformationForm";
import Text from "@/components/ui/Text";
import { COLORS } from "@/constants/utils/colors";
import { useAuth } from "@/context/AuthContext";
import { logout } from "@/services/authService";
import { getFullUserProfile, updateUserProfile } from "@/services/userService";
import { UserProfile } from "@/types/profile/profile";
import { Redirect, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";

type Mode = "view" | "edit_profile" | "personal_info";

export default function MyProfileScreen() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<Mode>("view");

  useEffect(() => {
    if (authUser?.uid) {
      loadProfile();
    }
  }, [authUser?.uid]);

  const loadProfile = async () => {
    if (!authUser?.uid) return;

    setLoading(true);
    try {
      const profile = await getFullUserProfile(authUser.uid, authUser.uid);
      setUser(profile);
      console.log("✅ Profile loaded:", profile);
    } catch (error) {
      console.error("❌ Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (payload: any) => {
    if (!authUser?.uid) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    setSaving(true);
    try {
      console.log("📤 Saving profile to Firebase:", payload);

      await updateUserProfile(authUser.uid, {
        fullName: payload.fullName,
        username: payload.username,
        bio: payload.bio || "",
      });

      console.log("✅ Profile saved to Firebase");
      await loadProfile();
      setMode("view");
      Alert.alert("Success", "Your profile has been updated!");
    } catch (error: any) {
      console.error("❌ Error saving profile:", error);
      Alert.alert(
        "Error",
        error.message || "Failed to update profile. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    console.log("🔵 Logout button clicked");

    const confirmLogout = true;

    if (confirmLogout) {
      console.log("🔵 Attempting logout...");

      try {
        const success = await logout();
        console.log("🔵 Logout result:", success);

        if (success) {
          console.log("✅ Redirecting to login");
          router.replace("/auth/login");
        } else {
          console.log("❌ Logout failed");
        }
      } catch (error) {
        console.error("❌ Logout error:", error);
      }
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (!authUser) {
    return <Redirect href="/auth/login" />;
  }

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Profile not found</Text>
      </View>
    );
  }

  const isEditing = mode === "edit_profile" || mode === "personal_info";

  const changeMode = (newMode: Mode) => {
    setMode(newMode);

    const isEditing = newMode === "edit_profile" || newMode === "personal_info";

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("profileEditChange", {
          detail: { editing: isEditing },
        })
      );
    }
  };

  const getTitle = () => {
    if (mode === "edit_profile") return "Edit Profile";
    if (mode === "personal_info") return "Personal Information";
    return undefined;
  };

  return (
    <ScrollView
      className="bg-neutral-100"
      style={{
        backgroundColor: COLORS.white,
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 100,
      }}
    >
      <View style={{ flex: 1, backgroundColor: COLORS.white }}>
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
            } else if (key === "personal") {
              changeMode("personal_info");
            } else if (key === "logout") {
              handleLogout();
            }
          }}
        />

        {mode === "view" && (
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <ProfileHeader
              user={user}
              onPressEdit={() => changeMode("edit_profile")}
            />

            <ProfileStat
              stats={user.stats}
              onPressItem={(key) => {
                router.push({
                  pathname: "profile/follow/[userId]",
                  params: {
                    userId: user.id,
                    initialTab: key,
                  },
                });
              }}
            />

            <ProfileActivity limit={3} userId={user.id} />
          </ScrollView>
        )}

        {mode === "edit_profile" && (
          <ProfileForm
            initial={{
              avatar: user.avatarUrl as any,
              username: user.username ?? "",
              fullName: user.name ?? "",
              email: authUser.email ?? "",
              bio: user.bio ?? "",
            }}
            onPickImage={() => {
              console.log("Edit avatar clicked");
              Alert.alert("Coming Soon", "Image upload will be available soon");
            }}
            onSave={handleSaveProfile}
            onCancel={() => setMode("view")}
            loading={saving}
          />
        )}

        {mode === "personal_info" && (
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
    </ScrollView>
  );
}
