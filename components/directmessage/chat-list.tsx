import { Chat } from "@/types/directmessage/dm";
import React from "react";
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
    <ScrollView className="flex-1 bg-white">
      {chats.map((chat) => (
        <TouchableOpacity
          key={chat.id}
          className={`px-4 py-3 border-b border-gray-100 ${
            selectedChat?.id === chat.id ? "bg-blue-50" : "active:bg-gray-50"
          }`}
          onPress={() => onSelectChat(chat)}
          activeOpacity={0.7}
        >
          <View className="flex-row items-center">
            <View className="mr-3">
              {chat.user?.avatar ? (
                <Image
                  source={{ uri: chat.user.avatar }}
                  className="w-14 h-14 rounded-full"
                />
              ) : (
                <View className="w-14 h-14 rounded-full bg-gray-300 items-center justify-center">
                  <Text className="text-white font-semibold text-lg">
                    {chat.user?.name?.charAt(0).toUpperCase() || "U"}
                  </Text>
                </View>
              )}
            </View>

            <View className="flex-1">
              <View className="flex-row justify-between items-center mb-1">
                <Text
                  className="font-semibold text-gray-900 text-base flex-1"
                  numberOfLines={1}
                >
                  {chat.user?.name}
                </Text>
                <Text className="text-xs text-gray-500 ml-2">
                  {formatTime(chat.lastMessage.timestamp)}
                </Text>
              </View>

              <Text
                className={`text-sm ${
                  !chat.lastMessage.read
                    ? "font-semibold text-gray-900"
                    : "text-gray-500"
                }`}
                numberOfLines={1}
              >
                {chat.lastMessage.text}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
