import ButtonDecision from "@/components/myroom/ButtonDecision"
import HeaderBack from "@/components/utils/HeaderBack"
import { COLORS } from "@/constants/utils/colors"
import { useAuthState } from "@/hooks/useAuthState"
import { useRoom } from "@/hooks/useRoom"
import { getCurrentUserData } from "@/services/authService"
import { initiateChat } from "@/services/directmessage/chatListService"
import { getRoomMembers, joinRoom } from "@/services/room.service"
import { getUserById } from "@/services/userService"
import { RoomEntry } from "@/types/myroom/room"
import { router, useLocalSearchParams } from "expo-router"
import React, { useEffect, useState } from "react"
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native"
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context"

type Member = {
    id: string
    name?: string
    username?: string
    avatarUrl?: string
}

export default function DetailRoom() {
    const { user } = useAuthState()
    const { uid: paramUid, id } = useLocalSearchParams()
    const uid = paramUid || user?.uid
    const insets = useSafeAreaInsets()
    const [modalVisible, setModalVisible] = useState(false)
    const [room, setRoom] = useState<RoomEntry | null>(null)
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [hostName, setHostName] = useState<string>("")
    const [hostAvatar, setHostAvatar] = useState<string | null>(null)
    const { getRoom, deleteRoom } = useRoom()
    const isOwner = true
    const [hasJoined, setHasJoined] = useState(false)
    const isEnded = false

    const [members, setMembers] = useState<Member[]>([])
    const [membersLoading, setMembersLoading] = useState(false)

    const fetchMembers = async () => {
        if (!room?.id) return

        setMembersLoading(true)
        try {
            const roomMembers = await getRoomMembers(room.id)
            console.log("Fetched members:", roomMembers)

            const fullMembers: Member[] = []

            for (const m of roomMembers) {
                const userData = await getUserById(m.id)
                if (userData) {
                    fullMembers.push({
                        id: m.id,
                        name: userData.name,
                        username: userData.username,
                        avatarUrl: userData.avatarUrl,
                    })
                }
            }

            if (room.fromUid) {
                const hostData = await getUserById(room.fromUid)
                if (hostData) {
                    const hostObj: Member = {
                        id: room.fromUid,
                        name: hostData.name,
                        username: hostData.username,
                        avatarUrl: hostData.avatarUrl,
                    }

                    const exists = fullMembers.some((m) => m.id === room.fromUid)
                    if (!exists) {
                        fullMembers.unshift(hostObj)
                    }
                }
            }

            setMembers(fullMembers)
        } catch (err) {
            console.error("Failed to fetch members:", err)
            setMembers([])
        } finally {
            setMembersLoading(false)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            if (!id || !uid) {
                setLoading(false)
                return
            }

            try {
                setLoading(true)

                const userData = await getCurrentUserData()
                setCurrentUser(userData)

                const roomRes = await getRoom(uid)

                if (roomRes.success && roomRes.data) {
                    const selectedRoom = roomRes.data.find((r) => r.id.toString() === id)
                    if (selectedRoom) {
                        setRoom(selectedRoom)

                        if (selectedRoom.fromUid) {
                            const userRes = await getUserById(selectedRoom.fromUid)
                            setHostName(userRes?.name || "Unknown Host")
                            setHostAvatar(userRes?.avatarUrl || null)
                        }
                    }
                }
            } catch (err) {
                setError("Failed to load data")
                console.log(err)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [id, uid])

    useEffect(() => {
        if (room?.id) {
            fetchMembers()
        }
    }, [room?.id])

    const handleInitiateChat = async () => {
        if (!currentUser?.id || !room) {
            alert("Data is invalid...")
            return
        }

        try {
            if (!room.fromUid || room.fromUid === "null") {
                alert("Sync blm kelar..")
                return
            }

            if (room.fromUid === currentUser.id) {
                alert("You are the host of this room.")
                return
            }

            const chatId = await initiateChat(currentUser.id, room.fromUid)
            console.log("ChatID:", chatId)

            router.push(`/directmessage/chat?id=${chatId}&hostId=${room.fromUid}`)
        } catch (err) {
            console.error(err)
        }
    }

    const handleDeleteRoom = async () => {
        console.log("Attempting to delete room...")

        if (!id) {
            console.error("Missing room ID")
            return
        }
        if (!uid) {
            console.error("Missing user UID")
            return
        }

        try {
            const res = await deleteRoom(id, uid)
            if (res?.success) {
                console.log("Success")
                router.back()
            } else {
                console.log("Failed to delete rooms")
            }
        } catch (err: any) {
            console.error(err)
            console.log("Something went wrong")
        }
    }

    const actualIsOwner = room?.fromUid === currentUser?.id

    const handleJoinRoom = async () => {
        if (!room || !currentUser?.id) return

        try {
            if (!room?.id || !currentUser?.id) return

            await joinRoom(room.id, currentUser.id)
            setHasJoined(true)

            alert("You have joined the room!")

            await fetchMembers()
        } catch (err) {
            console.error(err)
            alert("Failed to join room")
        }
    }

    if (loading) {
        return (
            <SafeAreaView
                className="flex-1 items-center justify-center"
                style={{ backgroundColor: COLORS.white }}
            >
                <ActivityIndicator size="large" color="#FCBC03" />
            </SafeAreaView>
        )
    }

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
            {room ? (
                <View>
                    <Image
                        source={
                            room.cover
                                ? { uri: room.cover }
                                : require("@/assets/page/detailroom/running.png")
                        }
                        style={{ width: "100%", height: 250 }}
                        resizeMode="cover"
                    />
                    <HeaderBack />
                </View>
            ) : (
                <View
                    className="flex-1 items-center justify-center"
                    style={{ backgroundColor: COLORS.white }}
                >
                    <ActivityIndicator size="large" color="#FCBC03" />
                </View>
            )}

            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                    paddingBottom: insets.bottom + 100,
                }}
                showsVerticalScrollIndicator={false}
            >
                <View className="px-[15px] pt-[20px] pb-[15px]">
                    {room ? (
                        <>
                            <View>
                                <Text className="font-inter font-medium text-[14px] text-primary">
                                    {room.category ?? "-"}
                                </Text>
                                <Text className="font-inter font-semibold text-[20px] text-black">
                                    {room.planName ?? "-"}
                                </Text>

                                <View className="flex-row items-center justify-between mt-2">
                                    <View className="flex-row items-center">
                                        {membersLoading ? (
                                            <ActivityIndicator size="small" color={COLORS.primary} />
                                        ) : members.length > 0 ? (
                                            <View className="flex-row">
                                                {members.slice(0, 3).map((member, index) => (
                                                    <View
                                                        key={member.id || index}
                                                        style={{
                                                            marginLeft: index === 0 ? 0 : -10,
                                                            zIndex: 3 - index,
                                                        }}
                                                    >
                                                        <Image
                                                            source={
                                                                member.avatarUrl
                                                                    ? { uri: member.avatarUrl }
                                                                    : require("@/assets/profile/empty-profile.jpg")
                                                            }
                                                            style={{
                                                                width: 32,
                                                                height: 32,
                                                                borderRadius: 16,
                                                                borderWidth: 2,
                                                                borderColor: COLORS.primary4th,
                                                                backgroundColor: COLORS.primary3rd,
                                                            }}
                                                        />
                                                    </View>
                                                ))}

                                                {members.length > 3 && (
                                                    <View
                                                        style={{
                                                            width: 32,
                                                            height: 32,
                                                            borderRadius: 16,
                                                            backgroundColor: COLORS.primary3rd,
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            marginLeft: -10,
                                                            borderWidth: 2,
                                                            borderColor: COLORS.primary4th,
                                                        }}
                                                    >
                                                        <Text className="text-[10px] font-semibold text-white">
                                                            +{members.length - 3}
                                                        </Text>
                                                    </View>
                                                )}
                                            </View>
                                        ) : (
                                            <View
                                                style={{
                                                    width: 32,
                                                    height: 32,
                                                    borderRadius: 16,
                                                    backgroundColor: COLORS.neutral100,
                                                    borderWidth: 2,
                                                    borderColor: COLORS.primary4th,
                                                }}
                                            />
                                        )}

                                        <Text className="ml-2 text-[12px] font-inter text-primary2nd">
                                            {members.length} {members.length === 1 ? "Member" : "Members"}
                                        </Text>
                                    </View>

                                    <TouchableOpacity
                                        onPress={() =>
                                            router.push({
                                                pathname: "/myroom/detailroom/allMember",
                                                params: { roomId: room?.id },
                                            })
                                        }
                                    >
                                        <Text className="text-[12px] text-primary font-medium font-inter">
                                            View All
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View className="mt-5">
                                <View>
                                    <Text className="font-inter font-semibold text-[14px] text-black">
                                        Event Details
                                    </Text>

                                    <View className="gap-4 mt-4">
                                        <View className="flex-row gap-3 items-center">
                                            <Image
                                                source={require("@/assets/page/detailroom/date.png")}
                                            />
                                            <View className="flex-col gap-1">
                                                <Text className="text-neutral-500 font-inter text-[14px] font-regular">
                                                    {room?.date.toLocaleDateString("id-ID", {
                                                        day: "2-digit",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                </Text>
                                                <Text className="text-neutral-700 font-inter text-[14px] font-medium">
                                                    {room.timeStart} - {room.timeEnd} WIB
                                                </Text>
                                            </View>
                                        </View>
                                        <View className="flex-row justify-between items-center">
                                            <View className="flex-row gap-3 items-center">
                                                <Image
                                                    source={require("@/assets/page/detailroom/map.png")}
                                                />
                                                <View className="flex-col gap-1">
                                                    <Text className="text-neutral-500 font-inter text-[14px] font-regular">
                                                        Location
                                                    </Text>
                                                    <Text className="text-neutral-700 font-inter text-[14px] font-medium">
                                                        {room.place}
                                                    </Text>
                                                    <Text className="text-neutral-700 font-inter text-[14px] font-regular">
                                                        Detail: {room.locationDetail}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View className="mt-5">
                                <View>
                                    <Text className="font-inter font-semibold text-[14px] text-black">
                                        Hosted By
                                    </Text>
                                    <View className="gap-4 mt-4 justify-between flex-row items-center">
                                        <View className="flex-row gap-3 items-center">
                                            <Image
                                                source={
                                                    hostAvatar
                                                        ? { uri: hostAvatar }
                                                        : require("@/assets/profile/empty-profile.jpg")
                                                }
                                                style={{
                                                    width: 36,
                                                    height: 36,
                                                    borderRadius: 18,
                                                }}
                                            />
                                            <Text className="font-inter font-normal text-[14px]">
                                                {hostName || "Unknown Host"}
                                            </Text>
                                        </View>
                                        <View>
                                            <TouchableOpacity onPress={handleInitiateChat}>
                                                <Image
                                                    source={require("@/assets/page/detailroom/chat.png")}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                </View>
                            </View>

                            <View className="mt-5">
                                <View>
                                    <Text className="font-inter font-semibold text-[14px] text-black">
                                        Description
                                    </Text>

                                    <View className="gap-4 mt-4 justify-between flex-row items-center">
                                        <Text className="font-inter text-[14px]">
                                            {room.description}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </>
                    ) : (
                        <View
                            className="flex-1 items-center justify-center"
                            style={{ backgroundColor: COLORS.white }}
                        >
                            <ActivityIndicator size="large" color="#FCBC03" />
                        </View>
                    )}
                </View>
            </ScrollView>

            <ButtonDecision
                isOwner={actualIsOwner}
                hasJoined={hasJoined}
                onJoinRoom={handleJoinRoom}
                isEnded={isEnded}
                onDeleteRoom={handleDeleteRoom}
                room={room}
                currentUser={currentUser}
                onMembersUpdate={fetchMembers}
            />
        </SafeAreaView>
    )
}