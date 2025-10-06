import { CardRoomProps } from "@/types/myroom/cardroom";
import React from "react";
import { Image, Text, View } from "react-native";

export default function CardRoom({
  title,
  date,
  location,
  slotRemaining,
  slotTotal,
  hostName,

  imageSource,
}: CardRoomProps) {
  return (
    <View className="bg-white rounded-[8px]  py-5 px-4">
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
            <Text className="text-[12px] font-semibold font-inter">
              {title}
            </Text>

            <View className="flex-row items-center gap-2 mt-1">
              <Image
                source={require("@/assets/page/myroom/calendar.svg")}
                className="w-3 h-3"
              />
              <Text className="text-[12px] font-inter text-neutral-700">
                {date}
              </Text>
            </View>

            <View className="flex-row items-center gap-2 mt-1">
              <Image
                source={require("@/assets/page/myroom/map.svg")}
                className="w-3 h-3"
              />
              <Text className="text-[12px] text-neutral-700 font-inter">
                {location}
              </Text>
            </View>
          </View>

          {/* Bagian bawah card */}
          <View className="flex-row justify-between items-center mt-2">
            <Text className="text-[10px] font-sans">
              Slot Remaining: {slotRemaining}/{slotTotal}
            </Text>

            <View className="flex-row items-center gap-1">
              <Text className="text-[10px] font-inter">Host by</Text>
              <View className="w-4 h-4 rounded-full bg-yellow-500" />
              <Text className="text-[10px] font-inter">{hostName}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
