import { ChatList } from "@/components/directmessage/chat-list";
import { FilterModal } from "@/components/directmessage/filter-bar";
import { SearchBar } from "@/components/directmessage/search-bar";
import { COLORS } from "@/constants/utils/colors";
import { getCurrentUserData } from "@/services/authService";
import { listenAllUserChats } from "@/services/directmessage/chatListService";
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
  const [searchValue, setSearchValue] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "all",
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const insets = useSafeAreaInsets();

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

    if (filters.query) {
      const query = filters.query.toLowerCase();
      result = result.filter(
        (chat) =>
          chat.user?.name?.toLowerCase().includes(query) ||
          chat.lastMessage.text.toLowerCase().includes(query) ||
          (chat.isGroupChat &&
            chat.groupData?.name?.toLowerCase().includes(query))
      );
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
            new Date(a.lastMessage.timestamp).getTime() -
            new Date(b.lastMessage.timestamp).getTime()
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

  const handleSearchChange = (query: string) => {
    setFilters((prev) => ({ ...prev, query }));
  };

  const handleFilterChange = (category: FilterType) => {
    setFilters((prev) => ({ ...prev, category }));
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
        <View className="justify-between items-start mt-8 px-4">
          <Text className="text-lg font-semibold py-3 text-neutral-900">
            Direct Message
          </Text>
        </View>

        <View>
          <SearchBar
            value={searchValue}
            onChange={handleSearchChange}
            onFilterPress={() => setIsFilterModalOpen(true)}
            selectedFilter={filters.category}
          />
        </View>

        <ChatList
          chats={filteredChats}
          selectedChat={null}
          onSelectChat={handleSelectChat}
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
