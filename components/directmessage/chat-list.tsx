import { COLORS } from "@/constants/utils/colors";
import { getUserById } from "@/services/userService";
import { Chat } from "@/types/directmessage/dm";
import { formatTime } from "@/utils/dateUtils";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";

interface ChatListProps {
  chats: Chat[];
  selectedChat: Chat | null;
  onSelectChat: (chat: Chat) => void;
  onDeleteChat: (chatId: string) => void;
  onMuteChat: (chatId: string) => void;
  currentUserId?: string;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  selectedChat,
  onSelectChat,
  onDeleteChat,
  onMuteChat,
  currentUserId,
}) => {
  const [chatUsers, setChatUsers] = useState<{ [key: string]: any }>({});
  const swipeableRefs = React.useRef<{ [key: string]: Swipeable | null }>({});

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
      if (chat.groupData?.cover) {
        return (
          <Image
            source={{ uri: chat.groupData.cover }}
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
      } else if (chatUser?.avatar) {
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

  // Last Message
  const getLastMessagePreview = (chat: Chat) => {
    if (!chat.lastMessage) return "Start a message...";

    const rawText = chat.lastMessage.text;
    let messageText = "";

    if (typeof rawText === "string") {
      messageText = rawText;
    } else if (typeof rawText === "object" && rawText !== null) {
      messageText = (rawText as any).text || "";
    }

    if (messageText.trim()) {
      return messageText;
    }
    if (chat.lastMessage.type === "image") {
      return "🖼️ Image";
    }

    return "Start a message...";
  };

  // Bisa dipakai buat hitung min max member
  const getMemberCountText = (chat: Chat) => {
    if (chat.isGroupChat) {
      const memberCount = chat.groupData?.memberUids?.length || 0;
      return `${memberCount} members`;
    }
    return null;
  };

  const renderRightActions = (chat: Chat) => {
    const isMuted = currentUserId
      ? chat.muteSettings?.[currentUserId]?.muted || false
      : false;

    return (
      <View className="flex-row" style={{ width: 160 }}>
        <TouchableOpacity
          className="flex-1 justify-center items-center"
          style={{
            backgroundColor: isMuted ? COLORS.neutral500 : COLORS.primary,
          }}
          onPress={() => {
            swipeableRefs.current[chat.id]?.close();
            onMuteChat(chat.id);
          }}
        >
          <Image
            source={
              isMuted
                ? require("../../assets/directmessage/unmute.png")
                : require("../../assets/directmessage/mute.png")
            }
            className="w-6 h-6"
          />
          <Text className="text-xs text-white mt-1">
            {isMuted ? "Unmute" : "Mute"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: COLORS.red }}
          onPress={() => {
            swipeableRefs.current[chat.id]?.close();
            onDeleteChat(chat.id);
          }}
        >
          <Image
            source={require("../../assets/directmessage/trash.png")}
            className="w-6 h-6"
          />
          <Text className="text-xs text-white mt-1">Delete</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView className="flex-1" style={{ backgroundColor: COLORS.white }}>
        {chats.map((chat) => {
          const isGroupChat = chat.isGroupChat;
          const displayName = getChatDisplayName(chat);
          const memberCountText = getMemberCountText(chat);

          return (
            <Swipeable
              key={chat.id}
              ref={(ref) => {
                swipeableRefs.current[chat.id] = ref;
              }}
              renderRightActions={() => renderRightActions(chat)}
              friction={2}
              rightThreshold={40}
            >
              <TouchableOpacity
                className={`px-4 py-3 border-b ${
                  selectedChat?.id === chat.id
                    ? "bg-blue-50"
                    : "active:bg-gray-50"
                }`}
                style={{
                  borderBottomColor: COLORS.neutral100,
                  backgroundColor:
                    selectedChat?.id === chat.id
                      ? COLORS.primary4th
                      : COLORS.white,
                }}
                onPress={() => onSelectChat(chat)}
                activeOpacity={0.7}
              >
                <View className="flex-row items-center">
                  <View className="mr-3">{getChatAvatar(chat)}</View>

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
                      {getLastMessagePreview(chat)}
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
            </Swipeable>
          );
        })}
      </ScrollView>
    </GestureHandlerRootView>
  );
};
