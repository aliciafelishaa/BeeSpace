//a
import HeaderBack from "@/components/utils/HeaderBack";
import SearchBar from "@/components/utils/SearchBar";
import { FOLLOWSTATUS } from "@/constants/page/followStatus";
import { COLORS } from "@/constants/utils/colors";
import { getRoomMembers } from "@/services/room.service";
import { getUserById } from "@/services/userService";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type Member = {
  id: string;
  name: string;
  username: string;
  isFollowed?: boolean;
};

export default function AllMember() {
  const { roomId } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);

  const toggleFollow = (id: string) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === id
          ? { ...member, isFollowed: !member.isFollowed }
          : member
      )
    );
  };

  useEffect(() => {
    console.log("AllMember useEffect running, roomId:", roomId);
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const roomMembers = await getRoomMembers(roomId);
        console.log("roomMembers:", roomMembers);

        const fetchedMembers: Member[] = [];

        for (const user of roomMembers) {
          const userData = await getUserById(user.id);
          if (userData) {
            fetchedMembers.push({
              id: user.id,
              name: userData.name,
              username: userData.username,
            });
          }
        }

        setMembers(fetchedMembers);
      } catch (err) {
        console.error("Failed to fetch members:", err);
        setMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [roomId]);

  const filteredMembers = members.filter((member) =>
    member.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: COLORS.white,
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
        <View>
          <View className="justify-center flex-row items-center">
            <HeaderBack />
            <Text className="items-center text-neutral-900 text-[28px] font-semibold pt-[45px]">
              Room Members
            </Text>
          </View>

          <View className="px-[15px] py-[35px]">
            <SearchBar
              placeholder="Search Username"
              containerStyle={{ marginRight: 8 }}
              onChangeText={(text) => setSearch(text)}
              value={search}
              onSearch={setSearch}
            />

            {loading ? (
              <View className="items-center justify-center mt-8">
                <ActivityIndicator size="large" color={COLORS.primary2nd} />
              </View>
            ) : (
              <View className="gap-[32px] mt-6">
                {filteredMembers.map((member) => (
                  <View
                    key={member.id}
                    className="justify-between flex-row items-center"
                  >
                    <View className="flex-row gap-4 items-center">
                      <View className="w-[36px] h-[36px] rounded-full bg-primary2nd" />
                      <View className="gap-1">
                        <Text className="font-inter font-normal text-[14px]">
                          {member.name}
                        </Text>
                        <Text className="font-inter font-normal text-[12px] text-neutral-500">
                          {member.username}
                        </Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => toggleFollow(member.id)}
                      className={`w-[90px] h-[40px] items-center justify-center rounded-[8px] border-2 ${
                        member.isFollowed
                          ? "bg-white border-primary2nd"
                          : "bg-primary2nd border-primary2nd"
                      }`}
                    >
                      <Text
                        className={`${member.isFollowed ? "text-primary2nd" : "text-white"}`}
                      >
                        {member.isFollowed
                          ? FOLLOWSTATUS.FOLLOWING
                          : FOLLOWSTATUS.FOLLOW}
                      </Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
