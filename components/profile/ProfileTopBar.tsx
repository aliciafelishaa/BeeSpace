import {
    ProfileMenuModal,
    type ProfileMenuKey,
} from "@/components/profile/ProfileMenuModal"
import { COLORS } from "@/constants/utils/colors"
import { router } from "expo-router"
import React, { useState } from "react"
import {
    Image,
    Platform,
    Text,
    TouchableOpacity,
    View
} from "react-native"

export interface ProfileTopBarProps {
    isOwnProfile?: boolean
    userId?: string
    userName?: string
    title?: string
    showShare?: boolean
    showMenu?: boolean
    onBack?: () => void
    onMenuNavigate?: (key: ProfileMenuKey) => void
}

export const ProfileTopBar: React.FC<ProfileTopBarProps> = ({
    isOwnProfile = true,
    title,
    showMenu = true,
    onBack,
    onMenuNavigate,
}) => {
    const [menuOpen, setMenuOpen] = useState(false)

    const handleBack = () => {
        if (onBack) {
            return onBack()
        }
        router.back()
    }

    const showBack = !!onBack

    return (
        <>
            <View
                style={{
                    paddingTop: Platform.select({ ios: 8, android: 8, default: 8 }),
                    paddingHorizontal: 16,
                    marginTop: 8,
                }}
            >
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    {showBack ? (
                        <TouchableOpacity
                            onPress={handleBack}
                            accessibilityLabel="Back"
                            
                            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                            style={{
                                width: 44,
                                height: 44,
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 999,
                            }}
                            activeOpacity={0.7}
                        >
                            <Image
                                source={require("@/assets/utils/arrow-left-back.png")}
                                style={{ width: 24, height: 24 }}
                                resizeMode="contain"
                            />
                        </TouchableOpacity>
                    ) : (
                        <View style={{ width: 44, height: 44 }} />
                    )}

                    {title ? (
                        <View
                            pointerEvents="none"
                            style={{
                                position: "absolute",
                                left: 0,
                                right: 0,
                                alignItems: "center",
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "600",
                                    color: COLORS.neutral900,
                                }}
                            >
                                {title}
                            </Text>
                        </View>
                    ) : null}

                    <View style={{ flexDirection: "row", columnGap: 12 }}>

                        {isOwnProfile && showMenu && (
                            <TouchableOpacity
                                onPress={() => setMenuOpen(true)}
                                accessibilityLabel="Open menu"
                                style={{
                                    width: 40,
                                    height: 40,
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 999,
                                }}
                                activeOpacity={0.7}
                            >
                                <Image
                                    source={require("@/assets/profile/icon-menu.png")}
                                    style={{ width: 24, height: 24 }}
                                    resizeMode="contain"
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>

            {isOwnProfile && showMenu && (
                <ProfileMenuModal
                    isOpen={menuOpen}
                    onClose={() => setMenuOpen(false)}
                    onNavigate={(key) => {
                        setMenuOpen(false)
                        onMenuNavigate?.(key)
                    }}
                />
            )}
        </>
    )
}
