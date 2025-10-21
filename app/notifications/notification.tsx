import { NotificationCard } from "@/components/notifications/NotificationCard";
import { NotificationFilterModal } from "@/components/notifications/NotificationFilterModal";
import SearchBar from "@/components/utils/SearchBar";
import { COLORS } from "@/constants/utils/colors";
import { mockNotifications } from "@/dummy/notificationData";
import {
  NotificationFilter,
  NotificationItem
} from "@/types/notifications/notification";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

export default function NotificationScreen() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>(mockNotifications);

  const markAsRead = useCallback((id: string) => {
    setItems(prev => prev.map(it => (it.id === id ? { ...it, read: true } : it)));
  }, []);

  const matchesSearch = useCallback((it: NotificationItem) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      it.title.toLowerCase().includes(q) ||
      (it.body?.toLowerCase().includes(q) ?? false) ||
      (it.senderName?.toLowerCase().includes(q) ?? false)
    );
  }, [search]);

  const filtered = useMemo(() => {
    let arr = items.filter(matchesSearch);
    if (filter === "unread") arr = arr.filter(it => !it.read);
    return arr.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [items, filter, matchesSearch]);

return (
  <View className="flex-1 bg-white">
    {/* Header */}
    <View className="flex-row items-center px-4 mt-8">
      <TouchableOpacity
        onPress={() => router.back()}
        className="w-10 h-10 items-center justify-center"
      >
        <Image
          source={require("@/assets/utils/arrow-left-back.png")}
          className="w-6 h-6"
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View className="flex-1 items-center justify-center">
        <Text 
          className="text-xl font-bold py-3" 
          style={{ color: COLORS.neutral900 }}
        >
          Notifications
        </Text>
      </View>
      
      <View className="w-10" />
    </View>

    {/* Search and Filter */}
    <View className="flex-row items-center gap-2 px-4 mb-2">
      <View className="flex-1">
        <SearchBar
          placeholder="Search Notifications"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <TouchableOpacity
        onPress={() => setOpen(true)}
        className="h-11 px-3 rounded-xl border justify-center"
        style={{ 
          borderColor: COLORS.neutral300,
          backgroundColor: COLORS.white 
        }}
      >
        <Text className="font-semibold" style={{ color: COLORS.neutral900 }}>
          {filter === "all" ? "All" : "Unread"} ▾
        </Text>
      </TouchableOpacity>
    </View>

    {/* Notification List */}
    <FlatList
      data={filtered}
      keyExtractor={(it) => it.id}
      renderItem={({ item }) => (
        <NotificationCard
          item={item}
          onSelectItem={() => {}}
          onMarkRead={markAsRead}
        />
      )}
      ItemSeparatorComponent={() => <View className="h-2.5" />}
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
      ListEmptyComponent={
        <View className="items-center justify-center py-20">
          <Text style={{ color: COLORS.neutral500 }}>No notifications found</Text>
        </View>
      }
    />

    <NotificationFilterModal
      isOpen={open}
      onClose={() => setOpen(false)}
      selectedFilter={filter}
      onFilterChange={(f) => { setFilter(f); setOpen(false); }}
    />
  </View>
);
}
