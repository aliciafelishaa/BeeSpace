import { ChatWindow } from "@/components/directmessage/chat";
import { ChatList } from "@/components/directmessage/chat-list";
import { FilterModal } from "@/components/directmessage/filter-bar";
import { SearchBar } from "@/components/directmessage/search-bar";
import { mockChats } from "@/dummy/data";
import { Chat, FilterType, SearchFilters } from "@/types/directmessage/dm";
import React, { useMemo, useState } from "react";

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
  }, [mockChats, filters]);

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
    <div className="flex h-screen bg-white">
      <div
        className={`${selectedChat ? "hidden md:flex" : "flex"} w-full md:w-80 lg:w-96 flex-col bg-white border-r border-gray-200`}
      >

        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-900">
              Direct Messageddd
            </h1>
          </div>
        </div>

        <div>
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            onFilterPress={() => setIsFilterModalOpen(true)}
            selectedFilter={filters.category}
          />
        </div>

        <ChatList
          chats={filteredChats}
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
        />
      </div>

      <div className={`${selectedChat ? "flex" : "hidden md:flex"} flex-1`}>
        <ChatWindow chat={selectedChat} onBack={() => setSelectedChat(null)} />
      </div>

      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedFilter={filters.category}
        onFilterChange={handleFilterChange}
      />
    </div>
  );
}
