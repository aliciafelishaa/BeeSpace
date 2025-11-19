import { CardRoomProps } from "@/types/myroom/cardroom";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useEffect, useState } from "react";
import { getUserById } from "@/services/userService";

export default function CardRoom({
    id,
    title,
    date,
    location,
    slotRemaining,
    slotTotal,
    hostName,
    imageSource,
    imageAvatar,
    isEdit,
    timeStart,
    timeEnd,
    hostUid,
    currentUserId,
}: CardRoomProps) {
    const formattedDate = date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        timeZone: "Asia/Jakarta",
    });
    const formattedTime =
        timeStart && timeEnd ? `${timeStart} - ${timeEnd} WIB` : "-";
    const isHost = hostUid === currentUserId;
    const [hostAvatarUrl, setHostAvatarUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchHost = async () => {
            if (!hostUid) return;

            try {
                const userData = await getUserById(hostUid);
                setHostAvatarUrl(userData?.avatarUrl || null);
            } catch (err) {
                console.log("Failed to fetch host avatar:", err);
            }
        };

        fetchHost();
    }, [hostUid]);


    return (
        <TouchableOpacity
            onPress={() => router.push(`/myroom/detailroom/detailRoom?id=${id}`)}
            className="bg-white rounded-[8px] py-5 px-4"
        >
            <View className="flex-row gap-4">
                {imageSource ? (
                    <Image
                        source={imageSource}
                        className="w-[80px] h-[80px] rounded-[8px]"
                        resizeMode="cover"
                    />
                ) : (
                    <View className="w-[80px] h-[80px] bg-primary rounded-[8px] " />
                )}

                <View className="flex-1 justify-between">
                    <View>
                        <Text className="text-[12px] font-interSemiBold">{title}</Text>

                        <View className="flex-row items-center gap-2 mt-1">
                            <Image
                                source={require("@/assets/page/myroom/calendar.png")}
                                className="w-3 h-3"
                            />
                            <Text className="text-[12px] font-interRegular text-neutral-700">
                                {formattedDate}
                            </Text>
                        </View>
                        <View className="flex-row items-center gap-2 mt-1">
                            <Image
                                source={require("@/assets/page/myroom/calendar.png")}
                                className="w-3 h-3"
                            />
                            <Text className="text-[12px] font-interRegular text-neutral-700">
                                {formattedTime}
                            </Text>
                        </View>

                        <View className="flex-row items-center gap-2 mt-1">
                            <Image
                                source={require("@/assets/page/myroom/map.png")}
                                className="w-3 h-3"
                            />
                            <Text className="text-[12px] text-neutral-700 font-interRegular">
                                {location}
                            </Text>
                        </View>
                    </View>

                    <View className="flex-row justify-between items-center mt-2">
                        <Text className="text-[10px] font-interRegular">
                            Slot Remaining: {slotRemaining}/{slotTotal}
                        </Text>

                        {!isHost ? (
                            <View className="flex-row items-center gap-1">
                                <Text className="text-[10px] font-interRegular">Host by</Text>
                                {hostAvatarUrl ? (
                                    <Image
                                        source={{ uri: hostAvatarUrl }}
                                        className="w-4 h-4 rounded-[8px]"
                                    />
                                ) : (
                                    <Image
                                        source={require("@/assets/profile/empty-profile.jpg")}
                                        className="w-4 h-4 rounded-[8px]"
                                    />
                                )}
                                <Text className="text-[10px] font-interRegular">
                                    {hostName}
                                </Text>
                            </View>
                        ) : (
                            <View className="flex-row items-center gap-1 bg-primary4th border border-primary2nd px-3 py-2  rounded-[4px]">
                                <Text className="text-[10px] font-interMedium text-primary2nd">
                                    Host by You
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}
