import { FollowListItem, FollowUser } from "@/components/profile/FollowListItem";
import SearchBar from "@/components/utils/SearchBar";
import { COLORS } from "@/constants/utils/colors";
import { router } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function FollowersScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [followers, setFollowers] = useState<FollowUser[]>([
    {
      id: "1",
      name: "Balqis Muharda",
      username: "bacica",
      isFollowing: false,
      isMe: false,
    },
    {
      id: "2",
      name: "Alicia Felisha",
      username: "aliciaf",
      isFollowing: true,
      isMe: false,
    },
    {
      id: "3",
      name: "Tasya Pandya",
      username: "tasya",
      isFollowing: false,
      isMe: false,
    },
  ]);

  const handleFollowToggle = (userId: string, currentlyFollowing: boolean) => {
    setFollowers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, isFollowing: !currentlyFollowing } : user
      )
    );
  };

  const handleMessage = (userId: string) => {
    router.push(`/messages/${userId}`);
  };

  const filteredFollowers = followers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.white }} edges={["top"]}>
      {/* Header - Exact same as notification */}
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
            Followers
          </Text>
        </View>
        
        <View className="w-10" />
      </View>

      {/* Search Bar */}
      <View className="px-4 mb-4">
        <SearchBar
          placeholder="Search Followers"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Followers List */}
      <FlatList
        data={filteredFollowers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FollowListItem
            user={item}
            onFollowToggle={handleFollowToggle}
            onMessage={handleMessage}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View className="h-4" />}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text style={{ color: COLORS.neutral500 }}>No followers found</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}