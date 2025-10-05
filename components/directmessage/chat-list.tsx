import { COLORS } from "@/constants/utils/colors";
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
    <ScrollView className="flex-1" style={{ backgroundColor: COLORS.white }}>
      {chats.map((chat) => (
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
              {chat.user?.avatar ? (
                <Image
                  source={{ uri: chat.user.avatar }}
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
                    {chat.user?.name?.charAt(0).toUpperCase() || "U"}
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
                  {chat.user?.name}
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
                  !chat.lastMessage.read ? "font-semibold" : ""
                }`}
                style={{
                  color: !chat.lastMessage.read
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
      ))}
    </ScrollView>
  );
};
