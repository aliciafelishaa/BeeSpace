import { ChatList } from "@/components/directmessage/chat-list";
import { FilterModal } from "@/components/directmessage/filter-bar";
import { SearchBar } from "@/components/directmessage/search-bar";
import { COLORS } from "@/constants/utils/colors";
import { getCurrentUserData } from "@/services/authService";
import {
  deleteChatForUser,
  listenAllUserChats,
} from "@/services/directmessage/chatListService";
import { muteChat } from "@/services/directmessage/chatMuteService";
import { Chat, FilterType, SearchFilters } from "@/types/directmessage/dm";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function MessagesPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "all",
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();
  const [searchInput, setSearchInput] = useState(filters.query);

  // Fetch User
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        setLoading(true);
        const userData = await getCurrentUserData();
        setCurrentUser(userData);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!currentUser?.id) return;

    const unsubscribe = listenAllUserChats(currentUser.id, (updatedChats) => {
      setChats(updatedChats);
    });

    return () => unsubscribe();
  }, [currentUser?.id]);

  const filteredChats = useMemo(() => {
    let result = [...chats];

    if (filters.query.trim() !== "") {
      const query = filters.query.toLowerCase();

      result = result.filter((chat) => {
        const name = chat.user?.name?.toLowerCase() ?? "";
        const lastMessage = chat.lastMessage?.text?.toLowerCase() ?? "";
        const groupName = chat.groupData?.name?.toLowerCase() ?? "";

        return (
          name.includes(query) ||
          lastMessage.includes(query) ||
          (chat.isGroupChat && groupName.includes(query))
        );
      });
    }

    switch (filters.category) {
      case "not-read":
        result = result.filter((chat) => chat.unreadCount > 0);
        break;
      case "newest":
        break;
      case "oldest":
        result = result.sort(
          (a, b) =>
            new Date(a.lastMessage?.timestamp || 0).getTime() -
            new Date(b.lastMessage?.timestamp || 0).getTime()
        );
        break;
      default:
        break;
    }

    return result;
  }, [chats, filters]);

  const handleSelectChat = (chat: Chat) => {
    router.push(`/directmessage/chat?id=${chat.id}&hostId=${chat.userId}`);
  };

  const handleFilterChange = (category: FilterType) => {
    setFilters((prev) => ({ ...prev, category }));
  };

  // Delete Chat
  const handleDeleteChat = async (chatId: string) => {
    try {
      if (!currentUser?.id) {
        return;
      }
      await deleteChatForUser(chatId, currentUser.id);
    } catch (err) {
      console.error(err);
    }
  };

  // Mute Chat
  const handleMuteChat = async (chatId: string) => {
    try {
      if (!currentUser?.id) {
        return;
      }
      await muteChat(chatId, currentUser.id);
    } catch (err) {
      console.error(err);
    }
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
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="justify-between items-start px-4">
          <Text className="text-[20px] font-semibold py-5 text-neutral-900">
            Direct Message
          </Text>
        </View>

        <View>
          <SearchBar
            value={searchInput}
            onChange={(text) => {
              setSearchInput(text);
              setFilters((prev) => ({ ...prev, query: text }));
            }}
            onFilterPress={() => setIsFilterModalOpen(true)}
            selectedFilter={filters.category}
          />
        </View>

        <ChatList
          chats={filteredChats}
          selectedChat={null}
          onSelectChat={handleSelectChat}
          onDeleteChat={handleDeleteChat}
          onMuteChat={handleMuteChat}
          currentUserId={currentUser?.id}
        />

        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          selectedFilter={filters.category}
          onFilterChange={handleFilterChange}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
