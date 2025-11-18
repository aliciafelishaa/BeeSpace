import { COLORS } from "@/constants/utils/colors";
import handleUpData from "@/hooks/useCloudinary";
import * as ExpoImagePicker from "expo-image-picker";
import React, { useState } from "react";
import {
  LayoutChangeEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProfileAvatarPicker } from "./ProfileAvatarPicker";
import { ProfileField } from "./ProfileField";

export type ProfileInformationValues = {
  avatar?: string;
  username: string;
  fullName: string;
  email: string;
  bio?: string;
  universityName?: string;
  major?: string;
  studentId?: string;
  enrollmentYear?: string;
  graduationYear?: string;
};

type Props = {
  initial?: Partial<ProfileInformationValues>;
  onSave?: (v: ProfileInformationValues) => void;
  onCancel?: () => void;
  loading?: boolean;
};

export function ProfileInformation({
  initial,
  onSave,
  onCancel,
  loading = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);

  const [form, setForm] = useState<ProfileInformationValues>({
    avatar: initial?.avatar,
    username: initial?.username ?? "",
    fullName: initial?.fullName ?? "",
    email: initial?.email ?? "",
    bio: initial?.bio ?? "",
    universityName: initial?.universityName ?? "",
    major: initial?.major ?? "",
    studentId: initial?.studentId ?? "",
    enrollmentYear: initial?.enrollmentYear ?? "",
    graduationYear: initial?.graduationYear ?? "",
  });

  const [footerHeight, setFooterHeight] = useState(180);

  const update = (k: keyof ProfileInformationValues) => (v: string) =>
    setForm((s) => ({ ...s, [k]: v }));

  const handlePickImage = async () => {
    try {
      const permission =
        await ExpoImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        alert("Permission to access gallery is required!");
        return;
      }

      const result = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets[0]) {
        setAvatarLoading(true);
        try {
          console.log("🔄 Uploading image to Cloudinary...");

          // UPLOAD KE CLOUDINARY - INI STEP PENTING!
          const fileForUpload = {
            uri: result.assets[0].uri,
            name: `profile-${Date.now()}.jpg`,
            type: "image/jpeg",
          };
          const cloudinaryUrl = await handleUpData(fileForUpload);

          if (cloudinaryUrl) {
            update("avatar")(cloudinaryUrl);
          } else {
            throw new Error("Upload failed - no URL returned");
          }
        } catch (error) {
          console.error("❌ Cloudinary upload error:", error);
          alert("Failed to upload image. Please try again.");
        } finally {
          setAvatarLoading(false);
        }
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert("Failed to pick image. Please try again.");
      setAvatarLoading(false);
    }
  };

  const handleSave = () => {
    if (!loading) {
      onSave?.(form);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setForm({
      avatar: initial?.avatar,
      username: initial?.username ?? "",
      fullName: initial?.fullName ?? "",
      email: initial?.email ?? "",
      bio: initial?.bio ?? "",
      universityName: initial?.universityName ?? "",
      major: initial?.major ?? "",
      studentId: initial?.studentId ?? "",
      enrollmentYear: initial?.enrollmentYear ?? "",
      graduationYear: initial?.graduationYear ?? "",
    });
    setIsEditing(false);
    onCancel?.();
  };

  const InfoRow = ({ label, value }: { label: string; value?: string }) => (
    <View style={{ marginBottom: 20 }}>
      <Text
        style={{
          fontFamily: "Inter_500Medium",
          fontSize: 13,
          color: COLORS.neutral500,
          marginBottom: 6,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          fontFamily: "Inter_400Regular",
          fontSize: 15,
          color: COLORS.neutral900,
        }}
      >
        {value || "-"}
      </Text>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: isEditing ? footerHeight + 40 : 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {!isEditing && (
          <TouchableOpacity
            onPress={() => setIsEditing(true)}
            style={{
              alignSelf: "flex-end",
              backgroundColor: COLORS.primary2nd,
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 8,
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                color: COLORS.white,
                fontSize: 14,
              }}
            >
              Edit Profile
            </Text>
          </TouchableOpacity>
        )}

        <ProfileAvatarPicker
          uri={form.avatar || undefined}
          onPick={handlePickImage}
          editable={isEditing}
        />

        {!isEditing ? (
          <View style={{ marginTop: 32 }}>
            <InfoRow label="Username" value={form.username} />
            <InfoRow label="Full Name" value={form.fullName} />
            <InfoRow label="Email" value={form.email} />
            <InfoRow label="Bio" value={form.bio} />

            <View
              style={{
                height: 1,
                backgroundColor: COLORS.neutral100,
                marginVertical: 20,
              }}
            />

            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                fontSize: 16,
                color: COLORS.neutral900,
                marginBottom: 20,
              }}
            >
              Student Information
            </Text>

            <InfoRow label="University's Name" value={form.universityName} />
            <InfoRow label="Major" value={form.major} />
            <InfoRow label="Student ID" value={form.studentId} />

            <View style={{ flexDirection: "row", gap: 20 }}>
              <View style={{ flex: 1 }}>
                <InfoRow label="Enrollment Year" value={form.enrollmentYear} />
              </View>
              <View style={{ flex: 1 }}>
                <InfoRow
                  label="Year of Graduation"
                  value={form.graduationYear}
                />
              </View>
            </View>
          </View>
        ) : (
          <View style={{ marginTop: 24, gap: 16 }}>
            <ProfileField
              label="Username"
              required
              value={form.username}
              onChangeText={update("username")}
              autoCapitalize="none"
            />

            <ProfileField
              label="Full Name"
              required
              value={form.fullName}
              onChangeText={update("fullName")}
              placeholder="Enter your full name"
            />

            <ProfileField
              label="Bio"
              value={form.bio}
              onChangeText={update("bio")}
              multiline
              numberOfLines={5}
              textClassName="h-28 py-3"
              placeholder="Tell us about yourself..."
            />
          </View>
        )}
      </ScrollView>

      {isEditing && (
        <View
          onLayout={(event: LayoutChangeEvent) => {
            const { height } = event.nativeEvent.layout;
            if (height > 0 && height !== footerHeight) {
              setFooterHeight(height);
            }
          }}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            paddingHorizontal: 20,
            paddingTop: 12,
            paddingBottom: insets.bottom + 12,
            backgroundColor: COLORS.white,
            borderTopWidth: 1,
            borderTopColor: COLORS.neutral100,
          }}
        >
          <TouchableOpacity
            disabled={loading}
            onPress={handleSave}
            style={{
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              backgroundColor: loading
                ? `${COLORS.primary3rd}99`
                : COLORS.primary2nd,
              shadowColor: "#000",
              shadowOpacity: 0.08,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 2 },
              marginBottom: 12,
            }}
          >
            <Text
              style={{ fontFamily: "Inter_600SemiBold", color: COLORS.white }}
            >
              {loading ? "Saving your changes.." : "Save Changes"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleCancel}
            disabled={loading}
            style={{
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: "center",
              borderWidth: 1,
              borderColor: COLORS.primary2nd,
              backgroundColor: COLORS.white,
            }}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                color: COLORS.primary2nd,
              }}
            >
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
