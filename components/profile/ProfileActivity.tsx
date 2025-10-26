import CardRoom from "@/components/myroom/CardRoom"
import EmptyState from "@/components/myroom/EmptyState"
import { COLORS } from "@/constants/utils/colors"
import { RoomEntry } from "@/types/myroom/room"
import React, { useEffect, useMemo, useState } from "react"
import { ActivityIndicator, Text, View } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useAuth } from "@/context/AuthContext"
import { collection, query, where, getDocs, Timestamp } from "firebase/firestore"
import { db } from "@/config/firebaseConfig"
import { getUserById } from "@/services/userService"

type Props = {
    title?: string
    limit?: number
    userId?: string
}

const isUpcoming = (dateStr: string | Date) => {
    if (!dateStr) return false

    try {
        const d = dateStr instanceof Date ? dateStr : new Date(dateStr)

        if (isNaN(d.getTime())) {
            console.warn("Invalid date:", dateStr)
            return false
        }

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const eventDate = new Date(d)
        eventDate.setHours(0, 0, 0, 0)

        return eventDate >= today
    } catch (error) {
        console.error("Error checking upcoming date:", error)
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
    const [rooms, setRooms] = useState<(RoomEntry & { id: string; hostName?: string })[]>([])

    const targetUserId = userId || authUser?.uid

    useEffect(() => {
        let mounted = true

        const fetchAllUserRooms = async () => {
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

                const joinedRooms = joinedSnapshot.docs.map((doc) => {
                    const data = doc.data()
                    return {
                        id: doc.id,
                        ...data,
                        date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
                    } as RoomEntry & { id: string }
                })

                const hostedRooms = hostedSnapshot.docs.map((doc) => {
                    const data = doc.data()
                    return {
                        id: doc.id,
                        ...data,
                        date: data.date instanceof Timestamp ? data.date.toDate() : data.date,
                    } as RoomEntry & { id: string }
                })

                const allRooms = [...joinedRooms, ...hostedRooms]
                const uniqueRooms = allRooms.filter(
                    (room, index, self) => index === self.findIndex((r) => r.id === room.id)
                )

                const roomsWithHostNames = await Promise.all(
                    uniqueRooms.map(async (room) => {
                        try {
                            const hostData = await getUserById(room.fromUid)
                            return {
                                ...room,
                                hostName: hostData?.name || "Anonymous",
                            }
                        } catch (error) {
                            console.error(`Error fetching host for room ${room.id}:`, error)
                            return {
                                ...room,
                                hostName: "Anonymous",
                            }
                        }
                    })
                )

                if (mounted) {
                    setRooms(roomsWithHostNames)
                    console.log(`✅ Loaded ${roomsWithHostNames.length} total rooms with host names`)
                }
            } catch (error) {
                console.error("❌ Error fetching rooms:", error)
            } finally {
                if (mounted) {
                    setLoading(false)
                }
            }
        }

        fetchAllUserRooms()

        return () => {
            mounted = false
        }
    }, [targetUserId])

    const upcoming = useMemo(() => {
        const filtered = rooms.filter((r) => {
            if (!r.date) {
                return false
            }

            const isUp = isUpcoming(r.date)
            return isUp
        })

        const sorted = filtered.sort((a, b) => {
            const dateA = new Date(a.date).getTime()
            const dateB = new Date(b.date).getTime()
            return dateA - dateB
        })

        const limited = sorted.slice(0, Math.max(0, limit))

        return limited
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
                    <ActivityIndicator />
                    <Text className="mt-2 text-[12px]" style={{ color: COLORS.neutral500 }}>
                        Loading rooms...
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