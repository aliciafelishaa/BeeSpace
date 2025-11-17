import { COLORS } from "@/constants/utils/colors";
import React, { useState } from "react";
import {
    LayoutChangeEvent,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    Image,
    Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProfileAvatarPicker } from "./ProfileAvatarPicker";
import { ProfileField } from "./ProfileField";
import * as ExpoImagePicker from "expo-image-picker";
import handleUpData from "@/hooks/useCloudinary";

export type ProfileInformationValues = {
    avatar?: string | any;
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

    const [footerHeight, setFooterHeight] = useState(0);

    const update =
        (k: keyof ProfileInformationValues) =>
            (v: string | any) =>
                setForm((s) => ({ ...s, [k]: v }));

    const handlePickImage = async () => {
        try {
            const permission = await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
            
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
                update("avatar")(result.assets[0].uri);
            }
        } catch (error) {
            console.error("Error picking image:", error);
            alert("Failed to pick image. Please try again.");
        }
    };

    const handleSave = async () => {
        if (loading) return;

        try {
            let finalAvatar = form.avatar;
            
            const isNewImage = typeof form.avatar === 'string' && 
                (form.avatar.startsWith('file://') || form.avatar.startsWith('blob:'));

            if (isNewImage) {
                console.log('🔄 Uploading new avatar to Cloudinary...');
                
                try {

                    const fileObj = { 
                        uri: form.avatar, 
                        name: "profile-picture.jpg", 
                        type: "image/jpeg" 
                    };
                    
                    finalAvatar = await handleUpData(fileObj);
                    console.log('✅ Avatar uploaded:', finalAvatar);
                } catch (uploadError) {
                    console.error('❌ Upload error:', uploadError);
                    Alert.alert(
                        'Upload Failed', 
                        'Failed to upload avatar. Please try again.',
                        [{ text: 'OK' }]
                    );
                    return;
                }
            } else {
                console.log('ℹ️ Using existing avatar URL');
            }

            const updatedProfile = {
                ...form,
                avatar: finalAvatar
            };

            console.log('💾 Calling onSave with:', updatedProfile);
            onSave?.(updatedProfile);
            setIsEditing(false);
        } catch (error) {
            console.error('❌ Error saving profile:', error);
            Alert.alert(
                'Error', 
                'Failed to save profile. Please try again.',
                [{ text: 'OK' }]
            );
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
            <Text style={{ fontFamily: "Inter_500Medium", fontSize: 13, color: COLORS.neutral500, marginBottom: 6 }}>
                {label}
            </Text>
            <Text style={{ fontFamily: "Inter_400Regular", fontSize: 15, color: COLORS.neutral900 }}>
                {value || "-"}
            </Text>
        </View>
    );

    return (
        <View style={{ flex: 1, minHeight: 0, position: "relative" }} >
            <ScrollView
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: isEditing ? footerHeight : 0,
                    ...(Platform.OS === "web" ? { overflowY: "auto" as any } : {}),
                }}
                contentContainerStyle={{
                    paddingHorizontal: 20,
                    paddingTop: 12,
                    paddingBottom: 24,
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                bounces={false}
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
                        <Text style={{ fontFamily: "Inter_600SemiBold", color: COLORS.white, fontSize: 14 }}>
                            Edit Profile
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Pass isEditing sebagai editable prop */}
                <ProfileAvatarPicker
                    uri={form.avatar as any}
                    onPick={handlePickImage}
                    editable={isEditing}
                />

                {!isEditing ? (
                    <View style={{ marginTop: 32 }}>
                        <InfoRow label="Username" value={form.username} />
                        <InfoRow label="Full Name" value={form.fullName} />
                        <InfoRow label="Email" value={form.email} />
                        <InfoRow label="Bio" value={form.bio} />

                        <View style={{ height: 1, backgroundColor: COLORS.neutral100, marginVertical: 20 }} />

                        <Text style={{ fontFamily: "Inter_600SemiBold", fontSize: 16, color: COLORS.neutral900, marginBottom: 20 }}>
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
                                <InfoRow label="Year of Graduation" value={form.graduationYear} />
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
                            backgroundColor: loading ? `${COLORS.primary3rd}99` : COLORS.primary2nd,
                            shadowColor: "#000",
                            shadowOpacity: 0.08,
                            shadowRadius: 6,
                            shadowOffset: { width: 0, height: 2 },
                            marginBottom: 12,
                        }}
                    >
                        <Text style={{ fontFamily: "Inter_600SemiBold", color: COLORS.white }}>
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
                        <Text style={{ fontFamily: "Inter_600SemiBold", color: COLORS.primary2nd }}>
                            Cancel
                        </Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}