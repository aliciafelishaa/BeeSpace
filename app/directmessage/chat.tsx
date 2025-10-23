import { ChatWindow } from "@/components/directmessage/chat";
import { getCurrentUserData } from "@/services/authService";
import { getGroupChat } from "@/services/directmessage/groupChatService";
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
  const [isGroupChat, setIsGroupChat] = useState(false);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const userData = await getCurrentUserData();
      setCurrentUser(userData);
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const initializeChat = async () => {
      if (!id || !currentUser) return;

      const isGroup = (id as string).startsWith("group_");
      setIsGroupChat(isGroup);

      if (isGroup) {
        const groupChatData = await getGroupChat(id as string);
        if (groupChatData) {
          const chatObj: Chat = {
            id: id as string,
            userId: groupChatData.hostUid,
            lastMessage: {
              id: "",
              text: groupChatData.lastMessage || "",
              timestamp: groupChatData.lastMessageTime || new Date(),
              senderId: "",
              read: true,
              type: "text",
            },
            unreadCount: 0,
            isGroupChat: true,
            groupData: {
              name: groupChatData.name,
              memberUids: groupChatData.memberUids,
              roomId: groupChatData.roomId,
            },
          };
          setChat(chatObj);
        }
      } else {
        if (!hostId) return;

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
          isGroupChat: false,
        };

        try {
          const userData = await getUserById(hostId as string);
          if (userData) {
            chatObj.user = userData;
          }
        } catch (err) {
          console.error(err);
        }
        setChat(chatObj);
      }
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
      <ChatWindow chat={chat} onBack={handleBack} isGroupChat={isGroupChat} />
    </View>
  );
}
