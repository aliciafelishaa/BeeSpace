import { COLORS } from "@/constants/utils/colors";
import { getCurrentUserData } from "@/services/authService";
import { listenMessages, sendMessage } from "@/services/dmService";
import { getUserById } from "@/services/userService";
import { Chat, Message } from "@/types/directmessage/dm";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ChatWindowProps {
  chat: Chat | null;
  onBack: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ chat, onBack }) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [chatUser, setChatUser] = useState<any>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Get User Dulu
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const userData = await getCurrentUserData();
      setCurrentUser(userData);
    };
    fetchCurrentUser();
  }, []);

  // Get chat by user
  useEffect(() => {
    const fetchChatUser = async () => {
      if (chat?.userId) {
        const userData = await getUserById(chat.userId);
        setChatUser(userData);
      }
    };
    fetchChatUser();
  }, [chat?.userId]);

  useEffect(() => {
    if (!chat) {
      setMessages([]);
      return;
    }

    const unsubscribe = listenMessages(
      chat.id,
      (msgs: React.SetStateAction<Message[]>) => {
        setMessages(msgs);
      }
    );

    return () => unsubscribe();
  }, [chat]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  const handleSendMessage = async () => {
    if (chat && newMessage.trim() && currentUser) {
      await sendMessage(chat.id, newMessage, currentUser.id);
      setNewMessage("");
    }
  };

  // Kalau misal g ad -> blm design
  if (!currentUser) {
    return (
      <View
        className="flex-1 items-center justify-center"
        style={{ backgroundColor: COLORS.neutral100 }}
      >
        <Text>No user found...</Text>
      </View>
    );
  }

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    // ScrollView
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ backgroundColor: COLORS.white, flex: 1 }}
    >
      <View
        className="px-6 py-4 flex-row items-center "
        style={{ backgroundColor: COLORS.white }}
      >
        <TouchableOpacity onPress={onBack} className="mr-8" activeOpacity={0.7}>
          <Image
            source={require("../../assets/directmessage/arrow-down.png")}
            className="w-6 h-6"
            style={{ transform: [{ rotate: "90deg" }] }}
          />
        </TouchableOpacity>

        {chatUser?.avatar ? (
          <Image
            source={{ uri: chatUser.avatar }}
            className="w-12 h-12 rounded-full mr-3"
          />
        ) : (
          <View
            className="w-12 h-12 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: COLORS.neutral300 }}
          >
            <Text
              className="font-semibold text-base"
              style={{ color: COLORS.white }}
            >
              {chatUser?.name?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
        )}

        <View className="flex-1">
          <Text
            className="font-bold text-lg"
            style={{ color: COLORS.neutral900 }}
          >
            {chatUser?.name || "Loading..."}
          </Text>
          <Text
            className="text-xs font-medium"
            style={{ color: COLORS.success }}
          >
            Online
          </Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={{
          backgroundColor: COLORS.neutral100,
          flex: 1,
          paddingVertical: 20,
          paddingHorizontal: 16,
        }}
      >
        {/* Masih HardCoded Date */}
        <View className="items-center mb-6">
          <View
            className="px-5 py-2 rounded-full"
            style={{ backgroundColor: COLORS.neutral300 }}
          >
            <Text className="text-xs" style={{ color: COLORS.neutral700 }}>
              Today
            </Text>
          </View>
        </View>

        <View>
          {messages.map((message) => {
            const isOwnMessage = message.senderId === currentUser.id;

            return (
              <View
                key={message.id}
                className={`mb-4 ${isOwnMessage ? "items-end" : "items-start"}`}
              >
                <View
                  className={`max-w-[80%] px-4 py-3 ${
                    isOwnMessage
                      ? "rounded-3xl rounded-br-sm"
                      : "rounded-3xl rounded-bl-sm"
                  }`}
                  style={{ backgroundColor: COLORS.white }}
                >
                  <Text
                    className="text-sm leading-5 mb-1"
                    style={{ color: COLORS.neutral900 }}
                  >
                    {message.text}
                  </Text>

                  <View className="flex-row items-center justify-end gap-1">
                    <Text
                      className="text-[10px]"
                      style={{ color: COLORS.neutral500 }}
                    >
                      {formatMessageTime(message.timestamp)}
                    </Text>
                    {isOwnMessage && (
                      <View className="ml-1 flex-row items-center">
                        {message.status === "read" && (
                          <>
                            <Ionicons
                              name="checkmark"
                              size={12}
                              color="#DC9010"
                            />
                            <Ionicons
                              name="checkmark"
                              size={12}
                              color="#DC9010"
                              style={{ marginLeft: -6 }}
                            />
                            <Text
                              className="text-[10px] ml-1"
                              style={{ color: "#DC9010" }}
                            >
                              Read
                            </Text>
                          </>
                        )}
                        {message.status === "delivered" && (
                          <>
                            <Ionicons
                              name="checkmark"
                              size={12}
                              color={COLORS.black}
                            />
                            <Ionicons
                              name="checkmark"
                              size={12}
                              color={COLORS.black}
                              style={{ marginLeft: -6 }}
                            />
                          </>
                        )}
                        {message.status === "sent" && (
                          <Ionicons
                            name="checkmark"
                            size={12}
                            color={COLORS.black}
                          />
                        )}
                      </View>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View
        className="px-4 py-3 border-t"
        style={{
          backgroundColor: COLORS.white,
          borderTopColor: COLORS.neutral100,
        }}
      >
        <View
          className="flex-row items-center rounded-full px-3 py-2"
          style={{ backgroundColor: COLORS.neutral100 }}
        >
          <TouchableOpacity className="mr-2" activeOpacity={0.7}>
            <Image
              source={require("../../assets/directmessage/LogoImg.png")}
              className="w-6 h-6"
            />
          </TouchableOpacity>

          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Write a chat..."
            className="flex-1 text-sm py-1"
            style={{ color: COLORS.neutral900 }}
            placeholderTextColor={COLORS.neutral500}
            multiline={false}
          />

          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={!newMessage.trim()}
            activeOpacity={0.7}
          >
            <Image
              source={require("../../assets/directmessage/LogoSend.png")}
              className="w-6 h-6"
              style={{
                opacity: newMessage.trim() ? 1 : 0.4,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
