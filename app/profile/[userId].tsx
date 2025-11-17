import ProfileActivity from "@/components/profile/ProfileActivity"
import ProfileHeader from "@/components/profile/ProfileHeader"
import ProfileStat from "@/components/profile/ProfileStats"
import { ProfileTopBar } from "@/components/profile/ProfileTopBar"
import { COLORS } from "@/constants/utils/colors"
import { UserProfile } from "@/types/profile/profile"
import { router, useLocalSearchParams } from "expo-router"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, View, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useAuth } from "@/context/AuthContext"
import { getFullUserProfile, followUser, unfollowUser } from "@/services/userService"
import Text from "@/components/ui/Text"

export default function UserProfileScreen() {
    const { userId } = useLocalSearchParams()
    const { user: authUser } = useAuth()
    const [user, setUser] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const [isUpdatingFollow, setIsUpdatingFollow] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const targetUserId = typeof userId === 'string' ? userId : undefined
    const currentUserId = authUser?.uid

    useEffect(() => {
        if (targetUserId) {
            fetchUserProfile()
        }
    }, [targetUserId, currentUserId])

    const fetchUserProfile = async () => {
        if (!targetUserId) {
            setError("Missing user ID")
            setLoading(false)
            return
        }

        setLoading(true)
        setError(null)

        try {
            const profile = await getFullUserProfile(targetUserId, currentUserId)

            if (profile) {
                if (currentUserId && targetUserId === currentUserId) {
                    router.replace("/profile")
                    return
                }
                setUser(profile)
                console.log("✅ Other profile loaded:", profile)
            } else {
                setError("User profile not found")
            }
        } catch (err) {
            console.error("❌ Error loading other profile:", err)
            setError("Failed to load user profile")
        } finally {
            setLoading(false)
        }
    }

    const handleFollowToggle = async (isCurrentlyFollowing: boolean) => {
        if (!currentUserId || !targetUserId || isUpdatingFollow) return

        setIsUpdatingFollow(true)

        try {
            if (isCurrentlyFollowing) {
                await unfollowUser(currentUserId, targetUserId)
                Alert.alert("Success", `You have unfollowed ${user?.username || 'user'}`)
            } else {
                await followUser(currentUserId, targetUserId)
                Alert.alert("Success", `You are now following ${user?.username || 'user'}`)
            }

            await fetchUserProfile()

        } catch (err) {
            console.error("❌ Follow/Unfollow error:", err)
            Alert.alert("Error", "Failed to update follow status. Please try again.")
        } finally {
            setIsUpdatingFollow(false)
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
                    <ProfileHeader
                        user={user}
                        onPressFollow={handleFollowToggle}
                        isUpdatingFollow={isUpdatingFollow}
                    />

                    <ProfileStat
                        stats={user.stats}
                    />

                    <ProfileActivity limit={3} userId={user.id} />
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}