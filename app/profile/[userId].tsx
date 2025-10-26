import ProfileActivity from "@/components/profile/ProfileActivity"
import ProfileHeader from "@/components/profile/ProfileHeader"
import ProfileStat from "@/components/profile/ProfileStats"
import { ProfileTopBar } from "@/components/profile/ProfileTopBar"
import { COLORS } from "@/constants/utils/colors"
import { mockProfiles } from "@/dummy/profileData"
import { UserProfile } from "@/types/profile/profile"
import { router, useLocalSearchParams } from "expo-router"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, Text, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

export default function UserProfileScreen() {
    const { userId } = useLocalSearchParams()
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (userId) {
            fetchUserProfile()
        }
    }, [userId])

    const fetchUserProfile = async () => {
        setLoading(true)
        setError(null)

        try {
            setTimeout(() => {
                const foundUser = mockProfiles.find(profile => profile.id === userId)

                if (foundUser) {
                    setUser(foundUser)
                } else {
                    setError("User not found")
                }
                setLoading(false)
            }, 500)
        } catch (err) {
            setError("Failed to load user profile")
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <SafeAreaView
                className="flex-1 items-center justify-center"
                style={{ backgroundColor: COLORS.white }}
            >
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text className="mt-4" style={{ color: COLORS.neutral500 }}>
                    Loading profile...
                </Text>
            </SafeAreaView>
        )
    }

    if (error || !user) {
        return (
            <SafeAreaView
                className="flex-1 items-center justify-center px-4"
                style={{ backgroundColor: COLORS.white }}
            >
                <Text className="text-lg font-semibold mb-2" style={{ color: COLORS.neutral900 }}>
                    {error || "User not found"}
                </Text>
                <Text style={{ color: COLORS.neutral500 }}>
                    Unable to load this profile
                </Text>
            </SafeAreaView>
        )
    }

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
                {/* Top Bar with Back button only */}
                <ProfileTopBar
                    isOwnProfile={false}
                    userId={user.id}
                    userName={user.name}
                    title={user.name}
                    showMenu={false}
                    showShare={false}
                    onBack={() => router.back()}
                />

                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                >
                    <ProfileHeader user={user} />

                    <ProfileStat
                        stats={user.stats}
                        onPressItem={(key) => {
                            router.push({
                                pathname: '/follow/[userId]',
                                params: {
                                    userId: user.id,
                                    initialTab: key
                                }
                            })
                        }}
                    />

                    <ProfileActivity limit={3} />
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}