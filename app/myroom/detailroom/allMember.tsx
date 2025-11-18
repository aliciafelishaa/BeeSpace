import HeaderBack from "@/components/utils/HeaderBack";
import SearchBar from "@/components/utils/SearchBar";
import { COLORS } from "@/constants/utils/colors";
import { useAuth } from "@/context/AuthContext";
import { useAuth } from "@/context/AuthContext";
import { getRoomMembers } from "@/services/room.service";
import {
    followUser,
    getFullUserProfile,
    getUserById,
    unfollowUser,
} from "@/services/userService";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

type Member = {
    id: string;
    name: string;
    username: string;
    avatarUrl?: string;
    isFollowing?: boolean;
    isMe?: boolean;
};

export default function AllMember() {
    const { roomId } = useLocalSearchParams();
    const { user: authUser } = useAuth();
    const insets = useSafeAreaInsets();
    const [search, setSearch] = useState("");
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(false);
    const [updatingFollowIds, setUpdatingFollowIds] = useState<Set<string>>(
        new Set()
    );

    const currentUserId = authUser?.uid;

    useEffect(() => {
        console.log("AllMember useEffect running, roomId:", roomId);
        fetchMembers();
    }, [roomId, currentUserId]);

    const fetchMembers = async () => {
        setLoading(true);
        try {
            const roomMembers = await getRoomMembers(roomId);
            console.log("roomMembers:", roomMembers);

            const fetchedMembers: Member[] = [];

            for (const user of roomMembers) {
                const userData = await getUserById(user.id);
                if (userData) {
                    let isFollowing = false;
                    const isMe = currentUserId === user.id;

                    if (currentUserId && !isMe) {
                        try {
                            const fullProfile = await getFullUserProfile(
                                user.id,
                                currentUserId
                            );
                            isFollowing = fullProfile?.relationship?.isFollowing ?? false;
                        } catch (err) {
                            console.error("Error fetching follow status:", err);
                        }
                    }

                    fetchedMembers.push({
                        id: user.id,
                        name: userData.name,
                        username: userData.username,
                        avatarUrl: userData.avatarUrl,
                        isFollowing,
                        isMe,
                    });
                }
            }

            setMembers(fetchedMembers);
        } catch (err) {
            console.error("Failed to fetch members:", err);
            setMembers([]);
        } finally {
            setLoading(false);
        }
    };

    const handleFollowToggle = async (memberId: string, isFollowing: boolean) => {
        if (!currentUserId || updatingFollowIds.has(memberId)) return;

        setUpdatingFollowIds((prev) => new Set(prev).add(memberId));

        try {
            if (isFollowing) {
                await unfollowUser(currentUserId, memberId);
                const memberName =
                    members.find((m) => m.id === memberId)?.username || "user";
                Alert.alert("Success", `You have unfollowed ${memberName}`);
            } else {
                await followUser(currentUserId, memberId);
                const memberName =
                    members.find((m) => m.id === memberId)?.username || "user";
                Alert.alert("Success", `You are now following ${memberName}`);
            }

            setMembers((prev) =>
                prev.map((member) =>
                    member.id === memberId
                        ? { ...member, isFollowing: !isFollowing }
                        : member
                )
            );
        } catch (err) {
            console.error("Follow/Unfollow error:", err);
            Alert.alert("Error", "Failed to update follow status. Please try again.");
        } finally {
            setUpdatingFollowIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(memberId);
                return newSet;
            });
        }
    };

    const filteredMembers = members.filter((member) =>
        member.username.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <SafeAreaView
            style={{
                flex: 1,
                backgroundColor: COLORS.white,
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
            >
                <View>
                    <View className="justify-center flex-row items-center">
                        <HeaderBack />
                        <Text className="items-center text-neutral-900 text-[28px] font-semibold pt-[45px]">
                            Room Members
                        </Text>
                    </View>

                    <View className="px-[15px] py-[35px]">
                        <SearchBar
                            placeholder="Search Username"
                            containerStyle={{ marginRight: 8 }}
                            onChangeText={(text) => setSearch(text)}
                            value={search}
                            onSearch={setSearch}
                        />

                        {loading ? (
                            <View className="items-center justify-center mt-8">
                                <ActivityIndicator size="large" color={COLORS.primary2nd} />
                            </View>
                        ) : (
                            <View className="gap-[32px] mt-6">
                                {filteredMembers.map((member) => {
                                    const isUpdating = updatingFollowIds.has(member.id);
                                    const isFollowing = member.isFollowing ?? false;

                                    return (
                                        <View
                                            key={member.id}
                                            className="justify-between flex-row items-center"
                                        >
                                            <View className="flex-row gap-4 items-center">
                                                <Image
                                                    source={
                                                        member.avatarUrl
                                                            ? { uri: member.avatarUrl }
                                                            : require("@/assets/profile/empty-profile.jpg")
                                                    }
                                                    style={{
                                                        width: 36,
                                                        height: 36,
                                                        borderRadius: 18,
                                                    }}
                                                />
                                                <View className="gap-1">
                                                    <Text className="font-inter font-normal text-[14px]">
                                                        {member.name}
                                                    </Text>
                                                    <Text className="font-inter font-normal text-[12px] text-neutral-500">
                                                        {member.username}
                                                    </Text>
                                                </View>
                                            </View>

                                            {member.isMe ? (
                                                <View
                                                    className="px-4 py-2 rounded-[10px] bg-neutral-100"
                                                    style={{
                                                        borderColor: COLORS.neutral300,
                                                        borderWidth: 1,
                                                    }}
                                                >
                                                    <Text
                                                        className="text-[14px]"
                                                        style={{ color: COLORS.neutral500 }}
                                                    >
                                                        You
                                                    </Text>
                                                </View>
                                            ) : (
                                                <TouchableOpacity
                                                    onPress={() =>
                                                        handleFollowToggle(member.id, isFollowing)
                                                    }
                                                    disabled={isUpdating}
                                                    className={`px-4 py-2 rounded-[10px] ${isFollowing
                                                            ? "bg-neutral-100 border"
                                                            : "bg-primary2nd"
                                                        }`}
                                                    style={{
                                                        borderColor: isFollowing
                                                            ? COLORS.neutral300
                                                            : "transparent",
                                                    }}
                                                >
                                                    {isUpdating ? (
                                                        <ActivityIndicator
                                                            size="small"
                                                            color={
                                                                isFollowing ? COLORS.neutral900 : COLORS.white
                                                            }
                                                        />
                                                    ) : (
                                                        <Text
                                                            className="text-[14px]"
                                                            style={{
                                                                color: isFollowing
                                                                    ? COLORS.neutral900
                                                                    : COLORS.white,
                                                            }}
                                                        >
                                                            {isFollowing ? "Following" : "Follow"}
                                                        </Text>
                                                    )}
                                                </TouchableOpacity>
                                            )}
                                        </View>
                                    );
                                })}
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}