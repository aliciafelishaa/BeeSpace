import { FollowListItem, FollowUser } from "@/components/profile/FollowListItem";
import SearchBar from "@/components/utils/SearchBar";
import { COLORS } from "@/constants/utils/colors";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type TabType = 'followers' | 'following';

export default function FollowScreen() {
  const { userId, initialTab } = useLocalSearchParams();
  
  const [activeTab, setActiveTab] = useState<TabType>(
    (initialTab as TabType) || 'followers'
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [followers, setFollowers] = useState<FollowUser[]>([]);
  const [following, setFollowing] = useState<FollowUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch data when component mounts or userId/activeTab changes
  useEffect(() => {
    if (activeTab === 'followers') {
      fetchFollowers();
    } else {
      fetchFollowing();
    }
  }, [userId, activeTab]);

  const fetchFollowers = async () => {
    setLoading(true);
    
    // TODO: Replace with your actual API call
    // const response = await api.getFollowers(userId);
    // setFollowers(response.data);
    
    // Mock data for now - replace this with real API call
    setTimeout(() => {
      setFollowers([
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
      setLoading(false);
    }, 500);
  };

  const fetchFollowing = async () => {
    setLoading(true);
    
    // TODO: Replace with your actual API call
    // const response = await api.getFollowing(userId);
    // setFollowing(response.data);
    
    // Mock data for now - replace this with real API call
    setTimeout(() => {
      setFollowing([
        {
          id: "4",
          name: "John Doe",
          username: "johnd",
          isFollowing: true,
          isMe: false,
        },
        {
          id: "5",
          name: "Jane Smith",
          username: "janes",
          isFollowing: true,
          isMe: false,
        },
      ]);
      setLoading(false);
    }, 500);
  };

  const handleFollowToggle = (userId: string, currentlyFollowing: boolean) => {
    // TODO: Call API to follow/unfollow
    // await api.toggleFollow(userId);
    
    if (activeTab === 'followers') {
      setFollowers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isFollowing: !currentlyFollowing } : user
        )
      );
    } else {
      setFollowing((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isFollowing: !currentlyFollowing } : user
        )
      );
    }
  };

  const handleMessage = (userId: string) => {
    router.push(`/messages/${userId}`);
  };

  const currentData = activeTab === 'followers' ? followers : following;
  
  const filteredData = currentData.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setSearchQuery(""); // Clear search when switching tabs
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.white }} edges={["top"]}>
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
            {activeTab === 'followers' ? 'Followers' : 'Following'}
          </Text>
        </View>
        
        <View className="w-10" />
      </View>

      {/* Tabs */}
      <View className="flex-row border-b" style={{ borderColor: COLORS.neutral300 }}>
        <TouchableOpacity
          className="flex-1 items-center py-3"
          onPress={() => handleTabChange('followers')}
          style={{
            borderBottomWidth: activeTab === 'followers' ? 2 : 0,
            borderBottomColor: COLORS.neutral500,
          }}
        >
          <Text
            className="font-semibold"
            style={{
              color: activeTab === 'followers' ? COLORS.neutral500 : COLORS.neutral500,
            }}
          >
            Followers
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-1 items-center py-3"
          onPress={() => handleTabChange('following')}
          style={{
            borderBottomWidth: activeTab === 'following' ? 2 : 0,
            borderBottomColor: COLORS.neutral500,
          }}
        >
          <Text
            className="font-semibold"
            style={{
              color: activeTab === 'following' ? COLORS.neutral500 : COLORS.neutral500,
            }}
          >
            Following
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View className="px-4 my-4">
        <SearchBar
          placeholder={`Search ${activeTab === 'followers' ? 'Followers' : 'Following'}`}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* List */}
      <FlatList
        data={filteredData}
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
            <Text style={{ color: COLORS.neutral500 }}>
              {loading 
                ? "Loading..." 
                : `No ${activeTab === 'followers' ? 'followers' : 'following'} found`
              }
            </Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}