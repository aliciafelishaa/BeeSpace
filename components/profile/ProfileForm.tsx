import { COLORS } from "@/constants/utils/colors"
import React, { useMemo, useState } from "react"
import {
    LayoutChangeEvent,
    Platform,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { ProfileAvatarPicker } from "./ProfileAvatarPicker"
import { ProfileField } from "./ProfileField"

export type ProfileFormValues = {
    avatar?: string | any
    username: string
    fullName: string
    email: string
    bio?: string
}

type Props = {
    initial?: Partial<ProfileFormValues>
    onSave?: (v: ProfileFormValues) => void
    onCancel?: () => void
    onPickImage?: () => void
    loading?: boolean
}

export function ProfileForm({
    initial,
    onSave,
    onCancel,
    onPickImage,
    loading = false,
}: Props) {
    const insets = useSafeAreaInsets()
    const [form, setForm] = useState<ProfileFormValues>({
        avatar: initial?.avatar,
        username: initial?.username ?? "",
        fullName: initial?.fullName ?? "",
        email: initial?.email ?? "",
        bio: initial?.bio ?? "",
    })

    const [footerHeight, setFooterHeight] = useState(150)

    const isEmail = (s: string) => /\S+@\S+\.\S+/.test(s.trim())
    const canSave = useMemo(
        () =>
            form.username.trim() &&
            form.fullName.trim() &&
            form.email.trim() &&
            isEmail(form.email),
        [form]
    )

    const update =
        (k: keyof ProfileFormValues) =>
            (v: string) =>
                setForm((s) => ({ ...s, [k]: v }))

    return (
        <View style={{ flex: 1, minHeight: 0, position: "relative" }}>
            <ScrollView
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: footerHeight,
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
                <ProfileAvatarPicker uri={form.avatar as any} onPick={onPickImage} />

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
                        label="Email"
                        required
                        value={form.email}
                        onChangeText={update("email")}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={false}
                        style={{ backgroundColor: COLORS.neutral50, color: COLORS.neutral500 }}
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

            </ScrollView>
            <View
                onLayout={(event: LayoutChangeEvent) => {
                    const { height } = event.nativeEvent.layout
                    if (height > 0 && height !== footerHeight) {
                        setFooterHeight(height)
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
                    disabled={!canSave || loading}
                    onPress={() => canSave && !loading && onSave?.(form)}
                    style={{
                        borderRadius: 16,
                        paddingVertical: 16,
                        alignItems: "center",
                        backgroundColor: canSave && !loading ? COLORS.primary2nd : `${COLORS.primary3rd}99`,
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
                    onPress={onCancel}
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
        </View>
    )
}