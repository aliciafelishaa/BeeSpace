import { COLORS } from "@/constants/utils/colors";
import { getUserById } from "@/services/userService";
import { Chat } from "@/types/directmessage/dm";
import { formatTime } from "@/utils/dateUtils";
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
        if (!chat.isGroupChat && chat.userId && !users[chat.userId]) {
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

  const getChatDisplayName = (chat: Chat) => {
    if (chat.isGroupChat) {
      return chat.groupData?.name || "Group Chat";
    } else {
      const chatUser = chatUsers[chat.userId] || chat.user;
      return chatUser?.name || "Unknown User";
    }
  };

  const getChatAvatar = (chat: Chat) => {
    if (chat.isGroupChat) {
      if (chat.groupData?.profilePicture) {
        return (
          <Image
            source={{ uri: chat.groupData.profilePicture }}
            className="w-14 h-14 rounded-full"
          />
        );
      } else {
        return (
          <View
            className="w-14 h-14 rounded-full items-center justify-center"
            style={{ backgroundColor: COLORS.primary2nd }}
          >
            <Text
              className="font-semibold text-lg"
              style={{ color: COLORS.white }}
            >
              {chat.groupData?.name?.charAt(0).toUpperCase() || "G"}
            </Text>
          </View>
        );
      }
    } else {
      const chatUser = chatUsers[chat.userId] || chat.user;
      if (chatUser?.avatar) {
        return (
          <Image
            source={{ uri: chatUser.avatar }}
            className="w-14 h-14 rounded-full"
          />
        );
      } else {
        return (
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
        );
      }
    }
  };

  // Bisa dipakai buat logic member nanti menghitung max member
  const getMemberCountText = (chat: Chat) => {
    if (chat.isGroupChat) {
      const memberCount = chat.groupData?.memberUids?.length || 0;
      return `${memberCount} members`;
    }
    return null;
  };

  return (
    // Check ScrollView alis
    <ScrollView className="flex-1" style={{ backgroundColor: COLORS.white }}>
      {chats.map((chat) => {
        const isGroupChat = chat.isGroupChat;
        const displayName = getChatDisplayName(chat);
        const memberCountText = getMemberCountText(chat);

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
              <View className="mr-3">{getChatAvatar(chat)}</View>

              {/* Content */}
              <View className="flex-1">
                <View className="flex-row justify-between items-center mb-1">
                  <View className="flex-1">
                    <Text
                      className="font-semibold text-base"
                      style={{ color: COLORS.neutral900 }}
                      numberOfLines={1}
                    >
                      {displayName}
                    </Text>
                    {memberCountText && (
                      <Text
                        className="text-xs mt-1"
                        style={{ color: COLORS.neutral500 }}
                      >
                        {memberCountText}
                      </Text>
                    )}
                  </View>
                  <Text
                    className="text-xs ml-2"
                    style={{ color: COLORS.neutral500 }}
                  >
                    {formatTime(chat.lastMessage.timestamp)}
                  </Text>
                </View>

                {/* Last Message */}
                <Text
                  className={`text-sm ${
                    chat.unreadCount > 0 ? "font-semibold" : ""
                  }`}
                  style={{
                    color:
                      chat.unreadCount > 0
                        ? COLORS.neutral900
                        : COLORS.neutral500,
                  }}
                  numberOfLines={1}
                >
                  {chat.lastMessage.text}
                </Text>

                {chat.unreadCount > 0 && (
                  <View
                    className="absolute -right-2 -top-1 w-5 h-5 rounded-full items-center justify-center"
                    style={{ backgroundColor: COLORS.primary2nd }}
                  >
                    <Text
                      className="text-xs font-bold"
                      style={{ color: COLORS.white }}
                    >
                      {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};
