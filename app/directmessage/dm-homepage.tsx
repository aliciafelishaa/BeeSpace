import { ChatWindow } from "@/components/directmessage/chat";
import { ChatList } from "@/components/directmessage/chat-list";
import { FilterModal } from "@/components/directmessage/filter-bar";
import { SearchBar } from "@/components/directmessage/search-bar";
import { COLORS } from "@/constants/utils/colors";
import { mockChats } from "@/dummy/data";
import { Chat, FilterType, SearchFilters } from "@/types/directmessage/dm";
import React, { useMemo, useState } from "react";
import { Text, View } from "react-native";

export default function DirectMessage() {
  const [searchValue, setSearchValue] = useState("");
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    query: "",
    category: "all",
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const filteredChats = useMemo(() => {
    let result = [...mockChats];

    if (filters.query) {
      const query = filters.query.toLowerCase();
      result = result.filter(
        (chat) =>
          chat.user?.name.toLowerCase().includes(query) ||
          chat.lastMessage.text.toLowerCase().includes(query)
      );
    }

    switch (filters.category) {
      case "not-read":
        result = result.filter((chat) => chat.unreadCount > 0);
        break;
      case "newest":
        result = result.sort(
          (a, b) =>
            new Date(b.lastMessage.timestamp).getTime() -
            new Date(a.lastMessage.timestamp).getTime()
        );
        break;
      case "oldest":
        result = result.sort(
          (a, b) =>
            new Date(a.lastMessage.timestamp).getTime() -
            new Date(b.lastMessage.timestamp).getTime()
        );
        break;
      default:
        result = result.sort(
          (a, b) =>
            new Date(b.lastMessage.timestamp).getTime() -
            new Date(a.lastMessage.timestamp).getTime()
        );
    }

    return result;
  }, [filters]);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const handleSearchChange = (query: string) => {
    setFilters((prev) => ({ ...prev, query }));
  };

  const handleFilterChange = (category: FilterType) => {
    setFilters((prev) => ({ ...prev, category }));
  };

  return (
    <View className="flex-1 bg-white flex-row rounded-2xl overflow-hidden">
      <View
        className={`
          ${selectedChat ? "hidden md:flex" : "flex"} 
          w-full md:w-80 lg:w-96 
          flex-col border-r border-neutral-300
        `}
        style={{ backgroundColor: COLORS.white }}
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
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
        />
      </View>

      <View className={`${selectedChat ? "flex" : "hidden md:flex"} flex-1`}>
        <ChatWindow chat={selectedChat} onBack={() => setSelectedChat(null)} />
      </View>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedFilter={filters.category}
        onFilterChange={handleFilterChange}
      />
    </View>
  );
}
