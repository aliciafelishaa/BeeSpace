import { currentUser, getMockMessages } from "@/dummy/data";
import { Chat, Message } from "@/types/directmessage/dm";
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
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (chat) {
      setMessages(getMockMessages(chat.id));
    } else {
      setMessages([]);
    }
  }, [chat]);

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim() && chat) {
      const newMsg: Message = {
        id: Date.now().toString(),
        text: newMessage.trim(),
        timestamp: new Date(),
        senderId: currentUser.id,
        read: true,
        type: "text",
        status: "sent",
      };

      setMessages((prev) => [...prev, newMsg]);
      setNewMessage("");
    }
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!chat) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F6F6F6]">
        <View className="items-center p-8">
          <View className="w-16 h-16 bg-gray-200 rounded-full items-center justify-center mb-4">
            <Text className="text-4xl">💬</Text>
          </View>
          <Text className="text-lg font-medium text-gray-900 mb-2 text-center">
            Select a chat to start messaging
          </Text>
          <Text className="text-gray-500 text-sm text-center">
            Choose a conversation from the list
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <View className="px-6 py-4 bg-white flex-row items-center">
        <TouchableOpacity onPress={onBack} className="mr-8" activeOpacity={0.7}>
          <Image
            source={require("../../assets/directmessage/arrow-down.png")}
            className="w-6 h-6"
            style={{ transform: [{ rotate: "90deg" }] }}
          />
        </TouchableOpacity>

        {chat.user?.avatar ? (
          <Image
            source={{ uri: chat.user.avatar }}
            className="w-12 h-12 rounded-full mr-3"
          />
        ) : (
          <View className="w-12 h-12 bg-gray-300 rounded-full items-center justify-center mr-3">
            <Text className="text-white font-semibold text-base">
              {chat.user?.name?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
        )}

        <View className="flex-1">
          <Text className="font-bold text-gray-900 text-lg">
            {chat.user?.name}
          </Text>
          <Text className="text-xs text-green-500 font-medium">Online</Text>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        className="flex-1 bg-[#F6F6F6]"
        contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 16 }}
      >

        <View className="items-center mb-6">
          <View className="bg-[#EBEBEB] px-5 py-2 rounded-full">
            <Text className="text-xs text-gray-600">Today</Text>
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
                      ? "bg-white rounded-3xl rounded-br-sm"
                      : "bg-white rounded-3xl rounded-bl-sm"
                  }`}
                >
                  <Text className="text-sm text-black leading-5 mb-1">
                    {message.text}
                  </Text>
                  <View className="flex-row items-center justify-end gap-1">
                    <Text className="text-[10px] text-gray-400">
                      {formatMessageTime(message.timestamp)}
                    </Text>
                    {isOwnMessage && message.status === "read" && (
                      <Text className="text-[10px] text-[#F59E0B] ml-1">
                        ✓✓ Read
                      </Text>
                    )}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View className="px-4 py-3 bg-white border-t border-gray-100">
        <View className="flex-row items-center bg-[#F6F6F6] rounded-full px-3 py-2">
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
            placeholderTextColor="#9CA3AF"
            className="flex-1 text-black text-sm py-1"
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
