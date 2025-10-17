import { COLORS } from "@/constants/utils/colors";
import { getUserById } from "@/services/userService";
import { Chat } from "@/types/directmessage/dm";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";

interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedChat,
  onSelectChat,
}) => {
  const [chatUsers, setChatUsers] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    const fetchChatUsers = async () => {
      const users: { [key: string]: any } = {};

      for (const chat of chats) {
        if (chat.userId && !users[chat.userId]) {
          const userData = await getUserById(chat.userId);
          if (userData) {
            users[chat.userId] = userData;
          }
        }
      }
      setChatUsers(users);
    };

    if (chats.length > 0) {
      fetchChatUsers();
    }
  }, [chats]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      return date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  return (
    <ScrollView className="flex-1" style={{ backgroundColor: COLORS.white }}>
      {chats.map((chat) => {
        const chatUser = chatUsers[chat.userId] || chat.user;

        return (
          <TouchableOpacity
            key={chat.id}
            className={`px-4 py-3 border-b ${
              selectedChat?.id === chat.id ? "bg-blue-50" : "active:bg-gray-50"
            }`}
            style={{
              borderBottomColor: COLORS.neutral100,
              backgroundColor:
                selectedChat?.id === chat.id ? COLORS.primary4th : COLORS.white,
            }}
            onPress={() => onSelectChat(chat)}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center">
              <View className="mr-3">
                {chatUser?.avatar ? (
                  <Image
                    source={{ uri: chatUser.avatar }}
                    className="w-14 h-14 rounded-full"
                  />
                ) : (
                  <View
                    className="w-14 h-14 rounded-full items-center justify-center"
                    style={{ backgroundColor: COLORS.neutral300 }}
                  >
                    <Text
                      className="font-semibold text-lg"
                      style={{ color: COLORS.white }}
                    >
                      {chatUser?.name?.charAt(0).toUpperCase() || "U"}
                    </Text>
                  </View>
                )}
              </View>

              <View className="flex-1">
                <View className="flex-row justify-between items-center mb-1">
                  <Text
                    className="font-semibold text-base flex-1"
                    style={{ color: COLORS.neutral900 }}
                    numberOfLines={1}
                  >
                    {chatUser?.name || "Loading..."}
                  </Text>
                  <Text
                    className="text-xs ml-2"
                    style={{ color: COLORS.neutral500 }}
                  >
                    {formatTime(chat.lastMessage.timestamp)}
                  </Text>
                </View>

                <Text
                  className={`text-sm ${
                    chat.lastMessage.read === false ? "font-semibold" : ""
                  }`}
                  style={{
                    color:
                      chat.lastMessage.read === false
                        ? COLORS.neutral900
                        : COLORS.neutral500,
                  }}
                  numberOfLines={1}
                >
                  {chat.lastMessage.text}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};
