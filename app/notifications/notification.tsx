import { NotificationCard } from "@/components/notifications/NotificationCard";
import { NotificationFilterModal } from "@/components/notifications/NotificationFilterModal";
import SearchBar from "@/components/utils/SearchBar";
import { COLORS } from "@/constants/utils/colors";
import {
    NotificationFilter,
    NotificationItem,
    NotificationType,
} from "@/types/notifications/notification";
import { router } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";

export default function NotificationScreen() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<NotificationFilter>("all");
  const [open, setOpen] = useState(false);

  const [items, setItems] = useState<NotificationItem[]>([
    { id: "1", title: "Plan Created", body: "Invite your friends to join your plan.", timestamp: new Date(), read: false, type: "plan_created" as NotificationType },
    { id: "2", title: "New Message", body: "From Alice. Check it out!", timestamp: new Date(), read: false, type: "new_message" as NotificationType, senderName: "Alice" },
    { id: "3", title: "Plan starts soon", body: "Your plan will start in 30 minutes.", timestamp: new Date(), read: true, type: "plan_start" as NotificationType },
  ]);

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
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingTop: 8,
          paddingBottom: 8,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center" }}
        >
          <Image
            source={require("@/assets/utils/arrow-left-back.png")}
            style={{ width: 24, height: 24 }}
            resizeMode="contain"
          />
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ fontSize: 20, fontWeight: "700", color: COLORS.neutral900 }}>
            Notifications
          </Text>
        </View>
        
        <View style={{ width: 40 }} />
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingHorizontal: 16,
          marginBottom: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <SearchBar
            placeholder="Search Notifications"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <TouchableOpacity
          onPress={() => setOpen(true)}
          style={{
            height: 44,
            paddingHorizontal: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: COLORS.neutral300,
            backgroundColor: COLORS.white,
            justifyContent: "center",
          }}
        >
          <Text style={{ fontWeight: "600", color: COLORS.neutral900 }}>
            {filter === "all" ? "All" : "Unread"} ▾
          </Text>
        </TouchableOpacity>
      </View>

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
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        ListEmptyComponent={
          <View style={{ alignItems: "center", justifyContent: "center", paddingVertical: 80 }}>
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
