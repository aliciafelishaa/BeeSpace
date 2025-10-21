import { ChatWindow } from "@/components/directmessage/chat";
// import { getCurrentUserData } from "@/services/authService";
import { getUserById } from "@/services/userService";
import { Chat } from "@/types/directmessage/dm";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

export default function ChatDetailPage() {
  const { id, hostId } = useLocalSearchParams();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [chat, setChat] = useState<Chat | null>(null);

  // useEffect(() => {
  //   const fetchCurrentUser = async () => {
  //     const userData = await getCurrentUserData();
  //     setCurrentUser(userData);
  //   };
  //   fetchCurrentUser();
  // }, []);

  useEffect(() => {
    const initializeChat = async () => {
      if (!id || !currentUser || !hostId) return;

      const chatObj: Chat = {
        id: id as string,
        userId: hostId as string,
        lastMessage: {
          id: "",
          text: "",
          timestamp: new Date(),
          senderId: "",
          read: true,
          type: "text",
        },
        unreadCount: 0,
      };

      // Pakai HostID
      try {
        const userData = await getUserById(hostId as string);
        if (userData) {
          chatObj.user = userData;
        }
      } catch (err) {
        console.error(err);
      }
      setChat(chatObj);
    };

    initializeChat();
  }, [id, currentUser, hostId]);

  const handleBack = () => {
    router.push("/directmessage/chatList");
  };

  if (!currentUser || !chat) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>No chat...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <ChatWindow chat={chat} onBack={handleBack} />
    </View>
  );
}
