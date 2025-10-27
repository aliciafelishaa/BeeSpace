import ButtonDecision from "@/components/myroom/ButtonDecision";
import HeaderBack from "@/components/utils/HeaderBack";
import { COLORS } from "@/constants/utils/colors";
import { useAuthState } from "@/hooks/useAuthState";
import { useRoom } from "@/hooks/useRoom";
import { getCurrentUserData } from "@/services/authService";
import { initiateChat } from "@/services/directmessage/chatListService";
import { getUserById } from "@/services/userService";
import { RoomEntry } from "@/types/myroom/room";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
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

export default function DetailRoom() {
  const { user } = useAuthState();
  const { uid: paramUid, id } = useLocalSearchParams();
  const uid = paramUid || user?.uid;
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);
  const [room, setRoom] = useState<RoomEntry | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hostName, setHostName] = useState<string>("");
  const { getRoom, deleteRoom } = useRoom();
  const isOwner = true;
  const hasJoined = false;
  const isEnded = false;

  // Fetch Data User
  useEffect(() => {
    const fetchData = async () => {
      if (!id || !uid) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const userData = await getCurrentUserData();
        setCurrentUser(userData);

        const roomRes = await getRoom(uid);

        if (roomRes.success && roomRes.data) {
          const selectedRoom = roomRes.data.find((r) => r.id.toString() === id);
          if (selectedRoom) {
            setRoom(selectedRoom);

            if (selectedRoom.fromUid) {
              const userRes = await getUserById(selectedRoom.fromUid);
              setHostName(userRes?.name || "Unknown Host");
            }
          }
        }
      } catch (err) {
        setError("Failed to load data");
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, uid]);

  // Perlu sync
  const handleInitiateChat = async () => {
    if (!currentUser?.id || !room) {
      alert("Data is invalid...");
      return;
    }

    try {
      if (!room.fromUid || room.fromUid === "null") {
        alert("Sync blm kelar..");
        return;
      }

      if (room.fromUid === currentUser.id) {
        alert("You are the host of this room.");
        return;
      }

      const chatId = await initiateChat(currentUser.id, room.fromUid);
      console.log("ChatID:", chatId);

      router.push(`/directmessage/chat?id=${chatId}&hostId=${room.fromUid}`);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteRoom = async () => {
    console.log("Attempting to delete room...");

    if (!id) {
      console.error("Missing room ID");
      return;
    }
    if (!uid) {
      console.error("Missing user UID");
      return;
    }

    try {
      const res = await deleteRoom(id, uid);
      if (res?.success) {
        console.log("Success");
        router.back();
      } else {
        console.log("Failed to delete rooms");
      }
    } catch (err: any) {
      console.error(err);
      console.log("Something went wrong");
    }
  };

  // Tentukan kondisi tombol
  // const currentUser = auth().currentUser;
  // const userId = currentUser?.uid;

  // 1️⃣ User adalah pembuat room
  // const isOwner = room?.fromUid === userId;

  // 2️⃣ Cek apakah sudah lewat waktunya
  // const roomDateTime = new Date(`${room?.date}T${room?.timeEnd}`);
  // const now = new Date();
  // const isEnded = now > roomDateTime;

  const actualIsOwner = room?.fromUid === currentUser?.id;

  if (loading) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: COLORS.white }}
      >
        <ActivityIndicator size="large" color="#FCBC03" />
      </SafeAreaView>
    );
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
                        {hostName || "Unknown Host"}
                      </Text>
                    </View>
                    <View>
                      {/* INI YANG Private CHAT */}
                      <TouchableOpacity onPress={handleInitiateChat}>
                        <Image
                          source={require("@/assets/page/detailroom/chat.svg")}
                        />
                      </TouchableOpacity>
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
        isEnded={isEnded}
        onDeleteRoom={handleDeleteRoom}
        room={room}
        currentUser={currentUser}
      />
    </SafeAreaView>
  );
}
