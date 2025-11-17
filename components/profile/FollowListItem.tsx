import { COLORS } from "@/constants/utils/colors"
import { router } from "expo-router"
import React from "react"
import { Image, Text, TouchableOpacity, View, ActivityIndicator } from "react-native"

export type FollowUser = {
    id: string
    name: string
    username: string
    avatarUrl?: string
    isFollowing: boolean
    isMe?: boolean
}

interface FollowListItemProps {
    user: FollowUser
    onFollowToggle: (userId: string, currentlyFollowing: boolean) => void
    onMessage: (userId: string) => void
    isUpdating: boolean
}

export const FollowListItem: React.FC<FollowListItemProps> = ({
    user,
    onFollowToggle,
    onMessage,
    isUpdating
}) => {
    const handleProfilePress = () => {
        if (user.isMe) {
            router.push("/profile")
        } else {
            router.push(`/profile/${user.id}`)
        }
    }

    const renderFollowButton = (isFollowing: boolean) => {
        return (
            <TouchableOpacity
                onPress={() => onFollowToggle(user.id, user.isFollowing)}
                className="px-4 py-2 rounded-lg"
                style={{
                    backgroundColor: isFollowing ? COLORS.neutral100 : COLORS.primary2nd,
                    borderColor: isFollowing ? COLORS.neutral300 : 'transparent',
                    borderWidth: isFollowing ? 1 : 0
                }}
                disabled={isUpdating}
            >
                {isUpdating ? (
                    <ActivityIndicator
                        size="small"
                        color={isFollowing ? COLORS.neutral900 : COLORS.white}
                    />
                ) : (
                    <Text
                        className="text-sm font-medium"
                        style={{ color: isFollowing ? COLORS.neutral900 : COLORS.white }}
                    >
                        {isFollowing ? "Following" : "Follow"}
                    </Text>
                )}
            </TouchableOpacity>
        )
    }

    return (
        <View className="flex-row items-center justify-between py-3">
            <TouchableOpacity
                onPress={handleProfilePress}
                className="flex-row items-center gap-3 flex-1"
                activeOpacity={0.7}
            >
                <View className="w-12 h-12 rounded-full overflow-hidden" style={{ backgroundColor: COLORS.primary2nd }}>
                    {user.avatarUrl ? (
                        <Image
                            source={{ uri: user.avatarUrl }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <View className="w-full h-full items-center justify-center">
                            <Text className="text-lg font-semibold text-white">
                                {user.name.charAt(0).toUpperCase()}
                            </Text>
                        </View>
                    )}
                </View>

                <View className="flex-1">
                    <Text
                        className="text-sm font-medium"
                        numberOfLines={1}
                        style={{ color: COLORS.neutral900 }}
                    >
                        {user.name}
                    </Text>
                    <Text
                        className="text-xs"
                        numberOfLines={1}
                        style={{ color: COLORS.neutral500 }}
                    >
                        @{user.username}
                    </Text>
                </View>
            </TouchableOpacity>

            {!user.isMe && (
                <View className="flex-row gap-2">
                    {user.isFollowing ? (
                        <>
                            <TouchableOpacity
                                onPress={() => onMessage(user.id)}
                                className="px-4 py-2 rounded-lg border"
                                style={{
                                    borderColor: COLORS.neutral300,
                                    backgroundColor: COLORS.white
                                }}
                                disabled={isUpdating}
                            >
                                <Text className="text-sm font-medium" style={{ color: COLORS.neutral900 }}>
                                    Message
                                </Text>
                            </TouchableOpacity>

                            {renderFollowButton(true)}
                        </>
                    ) : (
                        renderFollowButton(false)
                    )}
                </View>
            )}
        </View>
    )
}
