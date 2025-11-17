import { CardRoomProps } from "@/types/myroom/cardroom";
import { router } from "expo-router";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

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
}: CardRoomProps) {
  const formattedDate = date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Jakarta",
  });
  const formattedTime =
    timeStart && timeEnd ? `${timeStart} - ${timeEnd} WIB` : "-";

  return (
    <TouchableOpacity
      onPress={() => router.push(`/myroom/detailroom/detailRoom?id=${id}`)}
      className="bg-white rounded-[8px] py-5 px-4"
    >
      <View className="flex-row gap-4">
        {/* Gambar */}
        {imageSource ? (
          <Image
            source={imageSource}
            className="w-[80px] h-[80px] rounded-[8px]"
            resizeMode="cover"
          />
        ) : (
          <View className="w-[80px] h-[80px] bg-primary rounded-[8px] " />
        )}

        {/* Konten teks */}
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

          {/* Bagian bawah card */}
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-[10px] font-interRegular">
              Slot Remaining: {slotRemaining}/{slotTotal}
            </Text>

            <View className="flex-row items-center gap-1">
              <Text className="text-[10px] font-interRegular">Host by</Text>
              {imageAvatar ? (
                <Image
                  source={imageAvatar}
                  className="w-4 h-4 rounded-[8px]"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-4 h-4 bg-primary rounded-[8px] " />
              )}
              <Text className="text-[10px] font-interRegular">{hostName}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
