import ChatImagePicker from "@/components/directmessage/ChatImagePicker";
import { COLORS } from "@/constants/utils/colors";
import useUserStatus from "@/hooks/status/useUserStatus";
import handleUpData from "@/hooks/useCloudinary";
import { useMessageStatus } from "@/hooks/useMessageStatus";
import { getCurrentUserData } from "@/services/authService";
import {
  listenGroupMessages,
  listenMessages,
  sendGroupMessage,
  sendMessage,
} from "@/services/directmessage/dmService";
import { getUserById } from "@/services/userService";
import { Chat, Message, User } from "@/types/directmessage/dm";
import { formatLastSeen } from "@/utils/dateUtils";
import {
  formatDateSeparator,
  formatMessageTime,
  shouldShowDateSeparator,
} from "@/utils/timeFormatter";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Modal,
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
  isGroupChat?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  onBack,
  isGroupChat = false,
}) => {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [chatUser, setChatUser] = useState<any>(null);
  const [senderUsers, setSenderUsers] = useState<{ [userId: string]: User }>(
    {}
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [localImage, setLocalImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { isOnline, lastSeen } = useUserStatus(chat?.userId || null);
  const { markAsDelivered, markAsRead } = useMessageStatus({
    chatId: chat?.id || null,
    isGroupChat,
    groupMembers: chat?.groupData?.memberUids || [],
  });
  const scrollViewRef = useRef<ScrollView>(null);
  const processedMessagesRef = useRef<Set<string>>(new Set());

  // Get Current User
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const userData = await getCurrentUserData();
      setCurrentUser(userData);
    };
    fetchCurrentUser();
  }, []);

  // Buat fetch chat data
  useEffect(() => {
    const fetchChatData = async () => {
      if (!chat) return;

      if (isGroupChat) {
        setChatUser({
          name: chat.groupData?.name || "Group Chat",
          avatar: chat.groupData?.cover || null,
          isGroup: true,
        });
      } else {
        if (chat.userId) {
          const userData = await getUserById(chat.userId);
          setChatUser(userData);
        }
      }
    };
    fetchChatData();
  }, [chat, isGroupChat]);

  useEffect(() => {
    if (!chat) {
      setMessages([]);
      return;
    }

    const unsubscribe = isGroupChat
      ? listenGroupMessages(chat.id, (msgs: Message[]) => {
          setMessages(JSON.parse(JSON.stringify(msgs)));
        })
      : listenMessages(chat.id, (msgs: Message[]) => {
          setMessages(JSON.parse(JSON.stringify(msgs)));
        });

    return () => unsubscribe();
  }, [chat?.id, isGroupChat]);

  useEffect(() => {
    if (!currentUser?.id || !chat?.id || messages.length === 0) return;

    const otherUserMessages = messages.filter(
      (msg) => msg.senderId !== currentUser.id
    );

    const sentMessages = otherUserMessages.filter(
      (msg) => msg.status === "sent"
    );
    if (sentMessages.length > 0) {
      markAsDelivered(sentMessages.map((m) => m.id));
    }

    if (sentMessages.length > 0) {
      sentMessages.forEach((msg) => processedMessagesRef.current.add(msg.id));
      markAsDelivered(sentMessages.map((m) => m.id));
    }

    if (!isGroupChat) {
      const deliveredMessages = otherUserMessages.filter(
        (msg) => msg.status === "delivered"
      );
      if (deliveredMessages.length > 0) {
        markAsRead(deliveredMessages.map((m) => m.id));
      }
    }
  }, [
    messages,
    currentUser?.id,
    chat?.id,
    isGroupChat,
    markAsDelivered,
    markAsRead,
  ]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Image
  const handleSendImage = useCallback(
    async (imageUri: string) => {
      if (chat && currentUser) {
        try {
          setUploading(true);

          const file = {
            uri: imageUri,
            name: `chat_${Date.now()}.jpg`,
            type: "image/jpeg",
          };

          const cloudinaryUrl = await handleUpData(file);

          if (cloudinaryUrl) {
            const messageText = newMessage.trim() ? newMessage : "🖼️ Image";

            if (isGroupChat) {
              await sendGroupMessage(
                chat.id,
                messageText,
                currentUser.id,
                currentUser.name || currentUser.email,
                "image",
                cloudinaryUrl
              );
            } else {
              await sendMessage(
                chat.id,
                messageText,
                currentUser.id,
                "image",
                cloudinaryUrl
              );
            }

            setLocalImage(null);
            setNewMessage("");
          }
        } catch (err) {
          console.error(err);
        } finally {
          setUploading(false);
        }
      }
    },
    [chat, currentUser, isGroupChat, newMessage]
  );

  const handleSendMessage = async () => {
    if (localImage) {
      await handleSendImage(localImage);
      return;
    }

    if (chat && newMessage.trim() && currentUser) {
      if (isGroupChat) {
        await sendGroupMessage(
          chat.id,
          newMessage,
          currentUser.id,
          currentUser.name || currentUser.email
        );
      } else {
        await sendMessage(chat.id, newMessage, currentUser.id);
      }
      setNewMessage("");
    }
  };

  const renderMessageContent = (message: Message, isOwnMessage: boolean) => {
    if (message.type === "image" && message.mediaUrl) {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setSelectedImage(message.mediaUrl!)}
        >
          <Image
            source={{ uri: message.mediaUrl }}
            style={{
              width: 200,
              height: 150,
              borderRadius: 12,
              marginBottom: 4,
            }}
            resizeMode="cover"
          />
          {message.text && (
            <Text
              style={{
                color: isOwnMessage ? COLORS.white : COLORS.neutral900,
                fontSize: 14,
                lineHeight: 20,
              }}
            >
              {message.text}
            </Text>
          )}
        </TouchableOpacity>
      );
    }
    // Text
    return (
      <Text
        style={{
          color: isOwnMessage ? COLORS.white : COLORS.neutral900,
          fontSize: 14,
          lineHeight: 20,
        }}
      >
        {message.text}
      </Text>
    );
  };

  const renderMessageStatus = (message: Message, isOwnMessage: boolean) => {
    if (!isOwnMessage) return null;

    if (isGroupChat) {
      const isFullyRead = message.status === "read";

      return (
        <View className="ml-1 flex-row items-center">
          {isFullyRead ? (
            <>
              <Ionicons name="checkmark" size={12} color="#DC9010" />
              <Ionicons
                name="checkmark"
                size={12}
                color="#DC9010"
                style={{ marginLeft: -6 }}
              />
            </>
          ) : (
            <>
              <Ionicons name="checkmark" size={12} color="#DC9010" />
              <Ionicons
                name="checkmark"
                size={12}
                color="#DC9010"
                style={{ marginLeft: -6 }}
              />
            </>
          )}
        </View>
      );
    } else {
      return (
        <View className="ml-1 flex-row items-center">
          {message.status === "read" && (
            <>
              <Ionicons name="checkmark" size={12} color="#DC9010" />
              <Ionicons
                name="checkmark"
                size={12}
                color="#DC9010"
                style={{ marginLeft: -6 }}
              />
            </>
          )}
          {message.status === "delivered" && (
            <>
              <Ionicons name="checkmark" size={12} color={COLORS.white} />
              <Ionicons
                name="checkmark"
                size={12}
                color={COLORS.white}
                style={{ marginLeft: -6 }}
              />
            </>
          )}
          {message.status === "sent" && (
            <>
              <Ionicons name="checkmark" size={12} color={COLORS.white} />
              <Ionicons
                name="checkmark"
                size={12}
                color={COLORS.white}
                style={{ marginLeft: -6 }}
              />
            </>
          )}
        </View>
      );
    }
  };

  // Get Name
  const fetchSenderUser = useCallback(
    async (senderId: string) => {
      if (senderUsers[senderId] || !senderId) return;

      try {
        const userData = await getUserById(senderId);

        if (!userData) {
          return;
        }

        const user: User = {
          id: userData.id || senderId,
          name: userData.name || "User",
          avatar: userData.avatar,
          username: userData.username,
        };

        setSenderUsers((prev) => ({
          ...prev,
          [senderId]: user,
        }));
      } catch (err) {
        console.error(err);
      }
    },
    [senderUsers]
  );

  useEffect(() => {
    if (isGroupChat && messages.length > 0 && currentUser) {
      messages.forEach((message) => {
        if (
          message.senderId &&
          !senderUsers[message.senderId] &&
          message.senderId !== currentUser.id
        ) {
          fetchSenderUser(message.senderId);
        }
      });
    }
  }, [messages, isGroupChat, currentUser, fetchSenderUser, senderUsers]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ backgroundColor: COLORS.white, flex: 1 }}
      keyboardVerticalOffset={Platform.select({
        ios: 45,
        android: 0,
        default: 0,
      })}
    >
      <View
        className="px-6 py-4 flex-row items-center"
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
            style={{
              backgroundColor: isGroupChat
                ? COLORS.primary2nd
                : COLORS.neutral300,
            }}
          >
            <Text
              className="font-semibold text-base"
              style={{ color: COLORS.white }}
            >
              {isGroupChat
                ? "G"
                : chatUser?.name?.charAt(0).toUpperCase() || "U"}
            </Text>
          </View>
        )}

        <View className="flex-1">
          <Text
            className="font-bold text-lg"
            style={{ color: COLORS.neutral900 }}
          >
            {chatUser?.name || "Loading..."}
            {isGroupChat && " (Group)"}
          </Text>

          {!isGroupChat ? (
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: isOnline
                    ? COLORS.success
                    : COLORS.neutral500,
                  marginRight: 6,
                }}
              />
              <Text
                className="text-xs font-medium"
                style={{
                  color: isOnline ? COLORS.success : COLORS.neutral500,
                }}
              >
                {isOnline ? "Online" : `Last seen ${formatLastSeen(lastSeen)}`}
              </Text>
            </View>
          ) : (
            <Text
              className="text-xs font-medium"
              style={{ color: COLORS.success }}
            >
              {isGroupChat
                ? `${chat?.groupData?.memberUids?.length || 0} members`
                : ""}
            </Text>
          )}
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
        <View>
          {messages
            .filter((message) => message != null)
            .map((message, index) => {
              const isOwnMessage = message.senderId === currentUser?.id;
              const previousMessage = index > 0 ? messages[index - 1] : null;

              const showDateSeparator = shouldShowDateSeparator(
                message,
                previousMessage
              );

              return (
                <React.Fragment key={message.id}>
                  {showDateSeparator && (
                    <View className="items-center my-4">
                      <View
                        className="px-4 py-2 rounded-full"
                        style={{ backgroundColor: COLORS.neutral300 }}
                      >
                        <Text
                          className="text-xs"
                          style={{ color: COLORS.neutral700 }}
                        >
                          {formatDateSeparator(message.timestamp)}
                        </Text>
                      </View>
                    </View>
                  )}
                  <View
                    className={`mb-4 ${isOwnMessage ? "items-end" : "items-start"}`}
                  >
                    {isGroupChat && !isOwnMessage && (
                      <Text className="text-xs text-neutral-500 mb-1 ml-2">
                        {senderUsers[message.senderId]?.name ||
                          message.senderName ||
                          "User"}
                      </Text>
                    )}
                    <View
                      className={`max-w-[80%] px-4 py-3 ${
                        isOwnMessage
                          ? "rounded-3xl rounded-br-sm"
                          : "rounded-3xl rounded-bl-sm"
                      }`}
                      style={{
                        backgroundColor: isOwnMessage
                          ? COLORS.primary2nd
                          : COLORS.white,
                      }}
                    >
                      {renderMessageContent(message, isOwnMessage)}
                      <View className="flex-row items-center justify-end gap-1">
                        <Text
                          className="text-[10px]"
                          style={{
                            color: isOwnMessage
                              ? COLORS.primary4th
                              : COLORS.neutral500,
                          }}
                        >
                          {formatMessageTime(message.timestamp)}
                        </Text>
                        {isOwnMessage &&
                          renderMessageStatus(message, isOwnMessage)}
                      </View>
                    </View>
                  </View>
                </React.Fragment>
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
        {/* Preview - Image */}
        {localImage && (
          <View className="mb-3 relative">
            <Image
              source={{ uri: localImage }}
              style={{
                width: 120,
                height: 120,
                borderRadius: 12,
              }}
              resizeMode="cover"
            />
            <TouchableOpacity
              onPress={() => setLocalImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
            >
              <Ionicons name="close" size={16} color="white" />
            </TouchableOpacity>
            {uploading && (
              <View className="absolute inset-0 bg-black bg-opacity-50 rounded-12 items-center justify-center">
                <ActivityIndicator size="small" color="#FCBC03" />
              </View>
            )}
          </View>
        )}

        <View
          className="flex-row items-center rounded-full px-3 py-2"
          style={{ backgroundColor: COLORS.neutral100 }}
        >
          <ChatImagePicker onImageSelected={setLocalImage} />

          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Write a chat..."
            className="flex-1 text-sm py-1"
            style={{ color: COLORS.neutral900 }}
            placeholderTextColor={COLORS.neutral500}
            multiline={false}
            editable={!uploading}
          />

          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={(!newMessage.trim() && !localImage) || uploading}
            activeOpacity={0.7}
          >
            <Image
              source={require("../../assets/directmessage/LogoSend.png")}
              className="w-6 h-6"
              style={{
                opacity:
                  (newMessage.trim() || localImage) && !uploading ? 1 : 0.4,
              }}
            />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={!!selectedImage}
        transparent={true}
        animationType="fade"
        statusBarTranslucent={true}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.95)",
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <TouchableOpacity
            style={{
              position: "absolute",
              top: Platform.OS === "ios" ? 60 : 40,
              right: 20,
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 20,
              padding: 8,
            }}
            onPress={() => setSelectedImage(null)}
          >
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          {selectedImage && (
            <Image
              source={{ uri: selectedImage }}
              style={{
                width: "100%",
                height: "80%",
              }}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};
