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

  // Filter and search chats
  const filteredChats = useMemo(() => {
    let result = [...mockChats];

    // Apply search
    if (filters.query) {
      const query = filters.query.toLowerCase();
      result = result.filter(
        (chat) =>
          chat.user?.name.toLowerCase().includes(query) ||
          chat.lastMessage.text.toLowerCase().includes(query)
      );
    }

    // Apply category filters
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
        // Default: newest first (sesuai screenshot)
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
      {/* Sidebar - Left Panel */}
      <div
        className={`${selectedChat ? "hidden md:flex" : "flex"} w-full md:w-80 lg:w-96 flex-col bg-white border-r border-gray-200`}
      >
        {/* Header - Direct Message */}
        <div className="px-4 py-3 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-900">
              Direct Message
            </h1>
            <div className="flex items-center space-x-2">
              {/* Search Icon */}
              <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>

              {/* Filter Button */}
              <button
                onClick={() => setIsFilterModalOpen(true)}
                className="px-3 py-1 border border-blue-500 text-blue-500 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors"
              >
                Filter
              </button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="border-b border-gray-200">
          <SearchBar
            value={searchValue}
            onChange={setSearchValue}
            onFilterPress={() => setIsFilterModalOpen(true)}
            selectedFilter={filters.category}
          />
        </div>

        {/* Chat List */}
        <ChatList
          chats={filteredChats}
          selectedChat={selectedChat}
          onSelectChat={handleSelectChat}
        />
      </div>

      {/* Chat Window - Right Panel */}
      <div className={`${selectedChat ? "flex" : "hidden md:flex"} flex-1`}>
        <ChatWindow
          chat={selectedChat}
          onBack={() => setSelectedChat(null)} // ← TAMBAH INI
        />
      </div>
      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        selectedFilter={filters.category}
        onFilterChange={handleFilterChange}
      />

      
    </div>
  );
}
