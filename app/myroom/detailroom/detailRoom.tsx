import HeaderBack from "@/components/utils/HeaderBack";
import { COLORS } from "@/constants/utils/colors";
import { useRoom } from "@/hooks/useRoom";
import { RoomEntry } from "@/types/myroom/room";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function DetailRoom() {
  const { id } = useLocalSearchParams();
  console.log("ID dari route:", id);
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [rooms, setRooms] = useState<RoomEntry[]>([]);
  const { getRoom } = useRoom();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    console.log("DetailRoom rendered, id =", id);
  }, [id]);

  useEffect(() => {
    const fetchRoom = async () => {
      setLoading(true);
      const res = await getRoom();
      console.log("Response getRoom:", res);
      if (res.success && res.data) {
        const selectedRoom = res.data.find((r) => r.id.toString() === id);
        console.log("Selected Room:", selectedRoom);
        if (selectedRoom) {
          setRooms([selectedRoom]);
        } else {
          setRooms([]);
          console.log("❌ Room dengan ID ini tidak ada");
        }
      } else {
        setRooms([]);
        console.log("❌ getRoom gagal atau data kosong");
      }
      setLoading(false);
    };
    fetchRoom();
  }, [id]);

  const room = rooms[0];

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
        <Text>Loading...</Text>
      )}

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="px-[15px] pt-[20px] pb-[15px]">
          {/* Header Detail Event */}
          {room ? (
            <>
              <View>
                <>
                  <Text className="font-inter font-medium text-[14px] text-primary">
                    {room.category ?? "-"}
                  </Text>
                  <Text className="font-inter font-semibold text-[20px] text-black">
                    {room.planName ?? "-"}
                  </Text>
                </>

                <View className="flex-row items-center justify-between mt-2">
                  <View className="flex-row items-center">
                    <View className="flex-row">
                      {[1, 2, 3].map((item, index) => (
                        <View
                          key={index}
                          style={{
                            marginLeft: index === 0 ? 0 : -10,
                            zIndex: 3 - index,
                          }}
                        >
                          <Image
                            //   source={}
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

                      {/* +3 bubble */}
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
                          +3
                        </Text>
                      </View>
                    </View>

                    <Text className="ml-2 text-[12px] font-inter text-primary2nd">
                      Members
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => router.push("/myroom/detailroom/allMember")}
                  >
                    <Text className="text-[12px] text-primary font-medium font-inter">
                      View All
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Event Details */}
              <View className="mt-5">
                <View>
                  <Text className="font-inter font-semibold text-[14px] text-black">
                    Event Details
                  </Text>

                  <View className="gap-4 mt-4">
                    {/* Date */}
                    <View className="flex-row gap-3 items-center">
                      <Image
                        source={require("@/assets/page/detailroom/date.svg")}
                      ></Image>
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
                    {/* Time */}
                    <View className="flex-row justify-between items-center">
                      <View className="flex-row gap-3  items-center">
                        <Image
                          source={require("@/assets/page/detailroom/map.svg")}
                        ></Image>
                        <View className="flex-col gap-1">
                          <Text className="text-neutral-500 font-inter text-[14px] font-regular">
                            Location
                          </Text>
                          <Text className="text-neutral-700 font-inter text-[14px] font-medium">
                            {room.place}
                          </Text>
                        </View>
                      </View>
                      <Text className="text-primary2nd font-inter text-[12px]">
                        See Map
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Hosted By */}
              <View className="mt-5">
                <View>
                  <Text className="font-inter font-semibold text-[14px] text-black">
                    Hosted By
                  </Text>
                  <View className="gap-4 mt-4 justify-between flex-row items-center">
                    <View className="flex-row gap-3 items-center">
                      <View className="w-[36px] h-[36px] rounded-full bg-primary2nd"></View>
                      <Text className="font-inter font-normal text-[14px]">
                        {" "}
                        Balqis Muharda
                      </Text>
                    </View>
                    <View>
                      <Image
                        source={require("@/assets/page/detailroom/chat.svg")}
                      ></Image>
                    </View>
                  </View>
                </View>
              </View>

              {/* Description */}
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
            <Text>Loading...</Text>
          )}
        </View>
      </ScrollView>
      <View
        className="items-center w-full h-30 bg-white shadow-slate-200 absolute bottom-0 left-0 right-0 py-4 px-2 gap-3 flex-row"
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -1 },
          shadowOpacity: 0.09,
          shadowRadius: 4,
          elevation: 8,
        }}
      >
        <View className="rounded-[8px] h-[45px] bg-primary2nd items-center justify-center py-4 flex-1">
          <Text className="text-neutral-50 font-semibold text-[14px]">
            Join Room
          </Text>
        </View>
        <View className="rounded-[8px] w-[80px] h-[45px] bg-primary2nd items-center justify-center py-4">
          <Text className="text-neutral-50 font-semibold text-[14px]py-">
            ...
          </Text>
        </View>
      </View>

      {/* <ModalFilteringDynamic
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        filters={[
          {
            title: "Sort By",
            options: [
              "Earliest Time",
              "Nearest Location",
              "Most Popular",
              "Recently Added",
            ],
          },
        ]}
      /> */}
    </SafeAreaView>
  );
}
