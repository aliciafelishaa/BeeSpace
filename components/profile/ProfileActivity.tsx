import CardRoom from "@/components/myroom/CardRoom"
import EmptyState from "@/components/myroom/EmptyState"
import { db } from "@/config/firebaseConfig"
import { COLORS } from "@/constants/utils/colors"
import { useAuth } from "@/context/AuthContext"
import { getUserById } from "@/services/userService"
import { RoomEntry } from "@/types/myroom/room"
import { collection, DocumentData, getDocs, query, Timestamp, where } from "firebase/firestore"
import React, { useEffect, useMemo, useState } from "react"
import { ActivityIndicator, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"


type RoomWithHost = RoomEntry & { id: string; hostName?: string }

type Props = {
    title?: string
    limit?: number
    userId?: string
}

const parseRoomData = (doc: DocumentData & { id: string }): RoomWithHost => {
    const data = doc as RoomEntry
    return {
        ...data,
        id: doc.id,
        date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
    } as RoomWithHost
}

const isUpcoming = (dateStr: string | Date | undefined): boolean => {
    if (!dateStr) return false

    try {
        const d = dateStr instanceof Date ? dateStr : new Date(dateStr)
        if (isNaN(d.getTime())) return false

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        const eventDate = new Date(d)
        eventDate.setHours(0, 0, 0, 0)

        return eventDate >= today
    } catch {
        return false
    }
}

export const ProfileActivity: React.FC<Props> = ({
    title = "Upcoming Activity",
    limit = 3,
    userId,
}) => {
    const insets = useSafeAreaInsets()
    const { user: authUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [rooms, setRooms] = useState<RoomWithHost[]>([])

    const targetUserId = userId || authUser?.uid

    useEffect(() => {
        let mounted = true

        const fetchRooms = async () => {
            if (!targetUserId) return

            setLoading(true)
            try {
                const roomsRef = collection(db, "roomEvents")

                const joinedQuery = query(
                    roomsRef,
                    where("joinedUids", "array-contains", targetUserId)
                )

                const hostedQuery = query(
                    roomsRef,
                    where("fromUid", "==", targetUserId)
                )

                const [joinedSnapshot, hostedSnapshot] = await Promise.all([
                    getDocs(joinedQuery),
                    getDocs(hostedQuery),
                ])

                const joinedRooms = joinedSnapshot.docs.map(doc => parseRoomData({ id: doc.id, ...doc.data() }))
                const hostedRooms = hostedSnapshot.docs.map(doc => parseRoomData({ id: doc.id, ...doc.data() }))

                const allRooms = [...joinedRooms, ...hostedRooms]
                const uniqueRooms = allRooms.filter(
                    (room, index, self) => index === self.findIndex((r) => r.id === room.id)
                )

                const roomsWithHostNames = await Promise.all(
                    uniqueRooms.map(async (room) => {
                        const hostData = await getUserById(room.fromUid)
                        return {
                            ...room,
                            hostName: hostData?.name || "Anonymous",
                        }
                    })
                )

                if (mounted) {
                    setRooms(roomsWithHostNames)
                }
            } catch {
                if (mounted) {
                    setRooms([])
                }
            } finally {
                if (mounted) {
                    setLoading(false)
                }
            }
        }

        fetchRooms()

        return () => {
            mounted = false
        }
    }, [targetUserId])

    const upcoming = useMemo(() => {
        const filtered = rooms.filter(r => isUpcoming(r.date))

        const sorted = filtered.sort((a, b) => {
            const dateA = new Date(a.date).getTime()
            const dateB = new Date(b.date).getTime()
            return dateA - dateB
        })

        return sorted.slice(0, Math.max(0, limit))
    }, [rooms, limit])

    return (
        <View
            className="px-6 pt-4 pb-6"
            style={{ paddingBottom: (insets?.bottom ?? 0) + 12 }}
        >
            <Text
                className="text-[16px] font-semibold mb-3"
                style={{ color: COLORS.neutral900 }}
            >
                {title}
            </Text>

            {loading ? (
                <View className="py-8 items-center">
                    <ActivityIndicator color={COLORS.primary} />
                    <Text className="mt-2 text-[12px]" style={{ color: COLORS.neutral500 }}>
                        Loading activities...
                    </Text>
                </View>
            ) : upcoming.length > 0 ? (
                <View className="gap-4">
                    {upcoming.map((room) => (
                        <CardRoom
                            key={room.id}
                            id={room.id}
                            title={room.planName}
                            date={new Date(room.date)}
                            location={room.place}
                            slotRemaining={room.minMember}
                            slotTotal={room.maxMember}
                            hostName={room.hostName || "Anonymous"}
                            imageSource={room.cover ? { uri: room.cover } : undefined}
                            isEdit={false}
                            timeStart={room.timeStart}
                            timeEnd={room.timeEnd}
                        />
                    ))}
                </View>
            ) : (
                <View className="items-center mt-2">
                    <EmptyState variant="upcoming" width={90} height={60} />
                </View>
            )}
        </View>
    )
}

export default ProfileActivity
