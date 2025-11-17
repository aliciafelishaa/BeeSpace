import { ChatWindow } from "@/components/directmessage/chat";
import { db } from "@/config/firebaseConfig";
import { COLORS } from "@/constants/utils/colors";
import { getCurrentUserData } from "@/services/authService";
import { getGroupChat } from "@/services/directmessage/groupChatService";
import { getUserById } from "@/services/userService";
import { Chat } from "@/types/directmessage/dm";
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function ChatDetailPage() {
  const { id, hostId } = useLocalSearchParams();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [chat, setChat] = useState<Chat | null>(null);
  const [isGroupChat, setIsGroupChat] = useState(false);
  const insets = useSafeAreaInsets();
  const [loading, setLoading] = useState(true);

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
      setLoading(true);

      try {
        const isGroup = (id as string).startsWith("group_");
        setIsGroupChat(isGroup);

        if (isGroup) {
          const groupChatData = await getGroupChat(id as string);
          if (groupChatData) {
            let coverUrl = null;
            if (groupChatData.roomId) {
              try {
                const roomDoc = await getDoc(
                  doc(db, "roomEvents", groupChatData.roomId)
                );
                if (roomDoc.exists()) {
                  const roomData = roomDoc.data();
                  coverUrl = roomData?.cover || null;
                }
              } catch (err) {
                console.error(err);
              }
            }

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
                cover: coverUrl, 
                profilePicture: coverUrl, 
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
            if (userData) chatObj.user = userData;
          } catch (err) {
            console.error(err);
          }

          setChat(chatObj);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initializeChat();
  }, [id, currentUser, hostId]);

  const handleBack = () => {
    router.push("/directmessage/chatList");
  };

  if (loading) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: COLORS.white }}
      >
        <ActivityIndicator size="large" color="#FCBC03" />
      </View>
    );
  }

  if (!currentUser || !chat) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>No chat...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      className="bg-neutral-100"
      style={{
        backgroundColor: COLORS.white,
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: insets.bottom,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ChatWindow chat={chat} onBack={handleBack} isGroupChat={isGroupChat} />
      </ScrollView>
    </SafeAreaView>
  );
}
