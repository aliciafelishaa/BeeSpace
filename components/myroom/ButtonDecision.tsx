import { ButtonDecisionProps } from "@/types/myroom/buttondecision";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import ModalEditDelete from "../utils/ModalEditDelete";

export default function ButtonDecision({
  isOwner = false,
  hasJoined = false,
  isEnded = false,
  onDeleteRoom,
}: ButtonDecisionProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const { id } = useLocalSearchParams();

  useEffect(() => {
    console.log("🧠 [ButtonDecision Rendered]");
    console.log("isOwner:", isOwner);
    console.log("hasJoined:", hasJoined);
    console.log("isEnded:", isEnded);
  }, [isOwner, hasJoined, isEnded]);

  if (isOwner) {
    return (
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
        <TouchableOpacity
          className="rounded-[8px] h-[45px] bg-primary4th items-center justify-center py-4 flex-1 border-primary2nd border"
          onPress={() => router.push(`/myroom/detailroom/editRoom?id=${id}`)}
        >
          <Text className="text-primary font-interSemiBold text-[14px]">
            Edit Room
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-[8px] w-[80px] h-[45px] bg-primary4th border border-primary2nd items-center justify-center py-4"
          onPress={() => router.push("/directmessage/chatList")}
        >
          <Image source={require("@/assets/images/dm.png")}></Image>
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-[8px] w-[80px] h-[45px] bg-primary4th border border-primary2nd items-center justify-center py-4"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-primary font-interSemiBold text-[14px]">
            ...
          </Text>
        </TouchableOpacity>

        <ModalEditDelete
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          isJoin={true}
          isReport={false}
          isEdit={true}
          onDelete={onDeleteRoom}
        />
      </View>
    );
  }

  // Kondisi 2: user bukan owner & belum join & belum berakhir
  if (!isOwner && !hasJoined && !isEnded) {
    return (
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
        <TouchableOpacity className="rounded-[8px] h-[45px] bg-primary2nd items-center justify-center py-4 flex-1">
          <Text className="text-neutral-50 font-semibold text-[14px]">
            Join Room
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="rounded-[8px] w-[80px] h-[45px] bg-primary2nd items-center justify-center py-4"
          onPress={() => setModalVisible(true)}
        >
          <Text className="text-neutral-50 font-semibold text-[14px]py-">
            ...
          </Text>
        </TouchableOpacity>

        <ModalEditDelete
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          isJoin={true}
          isReport={true}
          isEdit={false}
          onDelete={onDeleteRoom}
        />
      </View>
    );
  }

  //   Kondisi 3: jika sudah ikut dan waktu event sudah lewat
  if (isEnded) {
    return (
      <View className="items-center w-full absolute bottom-0 left-0 right-0 py-4 bg-gray-100">
        <Text className="text-gray-500 font-medium text-[14px]">
          Activity has ended
        </Text>
      </View>
    );
  }

  // Kondisi jika sudah join tapi event belum selesai
  return (
    <View
      className="items-center w-full bg-white shadow-slate-200 absolute bottom-0 left-0 right-0 py-4 px-2 gap-3 flex-row"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.09,
        shadowRadius: 4,
        elevation: 8,
      }}
    >
      <TouchableOpacity className="rounded-[8px] flex-1 h-[45px] bg-[#E8F6EF] border border-[#4CAF50] items-center justify-center">
        <Text className="text-[#4CAF50] font-semibold text-[14px]">Joined</Text>
      </TouchableOpacity>
    </View>
  );
}
