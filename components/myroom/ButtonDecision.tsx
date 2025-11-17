import {
  getGroupChat,
  initiateGroupChat,
  joinGroupChat,
  leaveGroupChat,
} from "@/services/directmessage/groupChatService";
import { joinRoom, leaveRoom } from "@/services/room.service";
import { ButtonDecisionProps } from "@/types/myroom/buttondecision";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import ModalEditDelete from "../utils/ModalEditDelete";

export default function ButtonDecision({
  isOwner = false,
  hasJoined = false,
  isEnded = false,
  onJoinRoom,
  onDeleteRoom,
  room,
  currentUser,
}: ButtonDecisionProps & { room?: any; currentUser?: any }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [joined, setJoined] = useState(hasJoined);
  const { uid, id } = useLocalSearchParams();

  if (!room || !currentUser) {
    return null;
  }
  useEffect(() => {
    if (room?.joinedUids && currentUser?.id) {
      const isUserJoined = room.joinedUids.includes(currentUser.id);
      setJoined(isUserJoined);
    }
  }, [room, currentUser]);

  // Function Join Room jika diclick
  const handleJoinRoom = async () => {
    if (!room?.id || !currentUser?.id) {
      return;
    }
    try {
      const joinSuccess = await joinRoom(room.id, currentUser.id);

      if (!joinSuccess) {
        alert("Failed to join room!");
        return;
      }

      const chatId = `group_${room.id}`;
      const chatExists = await getGroupChat(chatId);

      if (chatExists) {
        await joinGroupChat(chatId, currentUser.id);
      } else {
        await initiateGroupChat(
          room.id,
          room.fromUid,
          room.planName,
          currentUser.id
        );
      }
      setJoined(true);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // Function Leave Room jika diclick
  const handleLeaveRoom = async () => {
    if (!room?.id || !currentUser?.id) {
      return;
    }
    try {
      const leaveRoomSuccess = await leaveRoom(room.id, currentUser.id);

      if (!leaveRoomSuccess) {
        return;
      }

      const chatId = `group_${room.id}`;
      await leaveGroupChat(chatId, currentUser.id);

      setJoined(false);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // Logic filtering Group Chat
  const handleGroupChat = async () => {
    if (!room?.id || !currentUser?.id) {
      alert("Invalid data!");
      return;
    }

    try {
      const chatId = `group_${room.id}`;

      const canAccessChat = isOwner || joined;

      if (!canAccessChat) {
        alert("Please join room chat first!");
        return;
      }

      const groupChat = await getGroupChat(chatId);

      if (!groupChat) {
        await initiateGroupChat(
          room.id,
          room.fromUid,
          room.planName,
          currentUser.id
        );
        await joinGroupChat(chatId, currentUser.id);
      }

      router.push(`/directmessage/chat?id=${chatId}&roomId=${room.id}`);
    } catch (err) {
      console.error("Error:", err);
    }
  };

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
          onPress={handleGroupChat}
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
          roomId={room.id}
        />
      </View>
    );
  }

  // Kondisi 2: user bukan owner & belum join & belum berakhir
  if (!isOwner && !joined && !isEnded) {
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
          className="rounded-[8px] h-[45px] bg-primary2nd items-center justify-center py-4 flex-1"
          onPress={handleJoinRoom}
        >
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
          roomId={room.id}
        />
      </View>
    );
  }

  // Kondisi 3: jika sudah ikut dan waktu event sudah lewat
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
  if (joined && !isEnded) {
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
        <TouchableOpacity
          className="rounded-[8px] h-[45px] items-center justify-center py-4 flex-1 border-red-800"
          style={{ backgroundColor: "#EF4444" }}
          onPress={handleLeaveRoom}
        >
          <Text className="text-neutral-50 font-semibold text-[14px]">
            Leave Group
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-[8px] w-[80px] h-[45px] bg-primary4th border border-primary2nd items-center justify-center py-4"
          onPress={handleGroupChat}
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
          isReport={true}
          isEdit={false}
          onDelete={onDeleteRoom}
          roomId={room.id}
        />
      </View>
    );
  }
}
