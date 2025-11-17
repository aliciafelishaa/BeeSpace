import { FollowListItem, FollowUser } from "@/components/profile/FollowListItem"
import SearchBar from "@/components/utils/SearchBar"
import { COLORS } from "@/constants/utils/colors"
import { useAuth } from "@/context/AuthContext"
import {
  followUser,
  getFollowersList,
  getFollowingList,
  getUserRelationship,
  unfollowUser
} from "@/services/userService"
import { router, useLocalSearchParams } from "expo-router"
import React, { useEffect, useState } from "react"
import { ActivityIndicator, Alert, FlatList, Image, Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

type TabType = 'followers' | 'following'

export default function FollowScreen() {
    const { userId, initialTab } = useLocalSearchParams()
    const { user: authUser } = useAuth()

    const targetUserId = typeof userId === 'string' ? userId : undefined
    const currentUserId = authUser?.uid

    const [activeTab, setActiveTab] = useState<TabType>(
        (initialTab as TabType) || 'followers'
    )
    const [searchQuery, setSearchQuery] = useState("")
    const [followers, setFollowers] = useState<FollowUser[]>([])
    const [following, setFollowing] = useState<FollowUser[]>([])
    const [loading, setLoading] = useState(true)
    const [updatingUserId, setUpdatingUserId] = useState<string | null>(null)

    const processUserList = async (list: Awaited<ReturnType<typeof getFollowersList>>): Promise<FollowUser[]> => {
        if (!currentUserId) return []

        const processedList = await Promise.all(list.map(async (user) => {
            const isMe = user.id === currentUserId
            let isFollowing = false

            if (!isMe) {
                const relationship = await getUserRelationship(currentUserId, user.id)
                isFollowing = relationship.isFollowing
            }

            return {
                id: user.id,
                name: user.name,
                username: user.username,
                isFollowing: isFollowing,
                isMe: isMe,
                avatarUrl: user.avatar
            } as FollowUser
        }))

        return processedList
    }

    const fetchFollowers = async () => {
        if (!targetUserId) return
        setLoading(true)
        try {
            const list = await getFollowersList(targetUserId)
            const processedList = await processUserList(list)
            setFollowers(processedList)
        } catch (error) {
            console.error("Error fetching followers:", error)
            Alert.alert("Error", "Failed to load followers.")
        } finally {
            setLoading(false)
        }
    }

    const fetchFollowing = async () => {
        if (!targetUserId) return
        setLoading(true)
        try {
            const list = await getFollowingList(targetUserId)
            const processedList = await processUserList(list)
            setFollowing(processedList)
        } catch (error) {
            console.error("Error fetching following:", error)
            Alert.alert("Error", "Failed to load following.")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (initialTab && (initialTab === 'followers' || initialTab === 'following')) {
            setActiveTab(initialTab as TabType)
        }
    }, [initialTab])

    useEffect(() => {
        if (!targetUserId || !currentUserId) return
        setFollowers([])
        setFollowing([])
        if (activeTab === 'followers') {
            fetchFollowers()
        } else {
            fetchFollowing()
        }
    }, [targetUserId, activeTab, currentUserId])

    const handleFollowToggle = async (idToToggle: string, currentlyFollowing: boolean) => {
        if (!currentUserId || !targetUserId || updatingUserId) return
        setUpdatingUserId(idToToggle)
        try {
            if (currentlyFollowing) {
                await unfollowUser(currentUserId, idToToggle)
            } else {
                await followUser(currentUserId, idToToggle)
            }
            const updateState = (prev: FollowUser[]) =>
                prev.map(user =>
                    user.id === idToToggle ? { ...user, isFollowing: !currentlyFollowing } : user
                )
            if (activeTab === 'followers') {
                setFollowers(updateState)
            } else {
                setFollowing(updateState)
            }
        } catch (error) {
            console.error("Error toggling follow:", error)
            Alert.alert("Error", "Failed to update follow status.")
        } finally {
            setUpdatingUserId(null)
        }
    }

    const handleMessage = (id: string) => {
        router.push(`/directmessage/${id}`)
    }

    const currentData = activeTab === 'followers' ? followers : following

    const filteredData = currentData.filter(
        (user) =>
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.username.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab)
        setSearchQuery("")
    }

    const renderListContent = () => {
        if (loading) {
            return (
                <View className="items-center justify-center py-20">
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            )
        }

        if (filteredData.length === 0) {
            return (
                <View className="items-center justify-center py-20">
                    <Text style={{ color: COLORS.neutral500 }}>
                        {`No ${activeTab === 'followers' ? 'followers' : 'following'} found`}
                    </Text>
                </View>
            )
        }

        return (
            <FlatList
                data={filteredData}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <FollowListItem
                        user={item}
                        onFollowToggle={handleFollowToggle}
                        onMessage={handleMessage}
                        isUpdating={updatingUserId === item.id}
                    />
                )}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                ItemSeparatorComponent={() => <View className="h-4" />}
                showsVerticalScrollIndicator={false}
            />
        )
    }

    if (!targetUserId) {
        return (
            <SafeAreaView className="flex-1 items-center justify-center" style={{ backgroundColor: COLORS.white }}>
                <Text>User ID not found</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.white }} edges={["top"]}>
            <View className="flex-row items-center px-4 mt-8">
                <TouchableOpacity
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center"
                >
                    <Image
                        source={require("@/assets/utils/arrow-left-back.png")}
                        className="w-6 h-6"
                        resizeMode="contain"
                    />
                </TouchableOpacity>

                <View className="flex-1 items-center justify-center">
                    <Text
                        className="text-xl font-bold py-3"
                        style={{ color: COLORS.neutral900 }}
                    >
                        {activeTab === 'followers' ? 'Followers' : 'Following'}
                    </Text>
                </View>

                <View className="w-10" />
            </View>

            <View className="flex-row border-b" style={{ borderColor: COLORS.neutral300 }}>
                <TouchableOpacity
                    className="flex-1 items-center py-3"
                    onPress={() => handleTabChange('followers')}
                    style={{
                        borderBottomWidth: activeTab === 'followers' ? 2 : 0,
                        borderBottomColor: COLORS.primary
                    }}
                >
                    <Text
                        className="font-semibold"
                        style={{
                            color: activeTab === 'followers' ? COLORS.primary : COLORS.neutral500
                        }}
                    >
                        Followers
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="flex-1 items-center py-3"
                    onPress={() => handleTabChange('following')}
                    style={{
                        borderBottomWidth: activeTab === 'following' ? 2 : 0,
                        borderBottomColor: COLORS.primary
                    }}
                >
                    <Text
                        className="font-semibold"
                        style={{
                            color: activeTab === 'following' ? COLORS.primary : COLORS.neutral500
                        }}
                    >
                        Following
                    </Text>
                </TouchableOpacity>
            </View>

            <View className="px-4 my-4">
                <SearchBar
                    placeholder={`Search ${activeTab === 'followers' ? 'Followers' : 'Following'}`}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <View className="flex-1">
                {renderListContent()}
            </View>
        </SafeAreaView>
    )
}
