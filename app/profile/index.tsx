import ChangePassword from "@/components/profile/ChangePassword";
import { ProfileActivity } from "@/components/profile/ProfileActivity";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import {
  ProfileInformation,
  ProfileInformationValues,
} from "@/components/profile/ProfileInformation";
import { ProfileStat } from "@/components/profile/ProfileStats";
import { ProfileTopBar } from "@/components/profile/ProfileTopBar";
import Text from "@/components/ui/Text";
import { COLORS } from "@/constants/utils/colors";
import { useAuth } from "@/context/AuthContext";
import { useProfileEdit } from "@/context/ProfileContext";
import { logout } from "@/services/authService";
import { getFullUserProfile, updateUserProfile } from "@/services/userService";
import { UserProfile } from "@/types/profile/profile";
import { Redirect, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type Mode = "view" | "profile" | "password";

export default function MyProfileScreen() {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<Mode>("view");
  const { setIsEditing } = useProfileEdit();

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
      console.log("Profile loaded:", profile);
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (payload: ProfileInformationValues) => {
    if (!authUser?.uid) {
      return;
    }

    setSaving(true);
    try {
      const updateData: any = {
        fullName: payload.fullName,
        username: payload.username,
        bio: payload.bio || "",
        updatedAt: new Date(),
      };

      if (payload.avatar && typeof payload.avatar === "string") {
        if (payload.avatar.startsWith("https://res.cloudinary.com/")) {
          updateData.profilePicture = payload.avatar;
        } else if (payload.avatar.startsWith("blob:")) {
          Alert.alert("Please wait for image to finish uploading...");
          return;
        }
      } else if (payload.avatar === null || payload.avatar === "") {
        updateData.profilePicture = null;
      }
      await updateUserProfile(authUser.uid, updateData);

      setUser(null);

      setUser((prev) =>
        prev
          ? {
              ...prev,
              name: updateData.fullName,
              username: updateData.username,
              bio: updateData.bio,
              avatarUrl: updateData.profilePicture || undefined,
            }
          : null
      );
      await loadProfile();

      setMode("view");
    } catch (err: any) {
      console.log("Error Cloudinary:", err);
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
          console.log("Redirecting to login");
          router.replace("/auth/login");
        } else {
          console.log("Logout failed");
        }
      } catch (error) {
        console.error("Logout error:", error);
      }
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10 }}>Loading...</Text>
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

  const isEditing = mode !== "view";

  const changeMode = (newMode: Mode) => {
    setMode(newMode);
    const isEditing = newMode !== "view";
    setIsEditing(isEditing);
  };

  const getTitle = () => {
    if (mode === "profile") return "Profile";
    if (mode === "password") return "Change Password";
    return undefined;
  };

  return (
    <SafeAreaView
      className="bg-[#FAFAFA]"
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
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
        className="bg-[#FAFAFA]"
      >
        <ProfileTopBar
          isOwnProfile
          userId={user.id}
          userName={user.name}
          title={getTitle()}
          showMenu={!isEditing}
          showShare={!isEditing}
          onBack={isEditing ? () => changeMode("view") : undefined}
          onMenuNavigate={(key) => {
            if (key === "profile") {
              changeMode("profile");
            } else if (key === "password") {
              changeMode("password");
            } else if (key === "logout") {
              handleLogout();
            }
          }}
        />

        {mode === "view" && (
          <View style={{ flex: 1 }}>
            <ProfileHeader
              user={user}
              onPressEdit={() => changeMode("profile")}
            />

            <ProfileStat stats={user.stats} />

            <ProfileActivity limit={3} userId={user.id} />
          </View>
        )}

        {mode === "profile" && (
          <ProfileInformation
            initial={{
              avatar: user.avatarUrl as any,
              username: user.username ?? "",
              fullName: user.name ?? "",
              email: authUser.email ?? "",
              bio: user.bio ?? "",
              universityName: user.university ?? "",
              major: user.major ?? "",
              studentId: user.studentID ?? "",
              enrollmentYear: user.enrollYear ?? "",
              graduationYear: user.gradYear ?? "",
            }}
            onSave={handleSaveProfile}
            onCancel={() => setMode("view")}
            loading={saving}
          />
        )}

        {mode === "password" && <ChangePassword email={authUser.email || ""} />}
      </ScrollView>
    </SafeAreaView>
  );
}
