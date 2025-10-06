import HeaderBack from "@/components/utils/HeaderBack";
import SearchBar from "@/components/utils/SearchBar";
import { FOLLOWSTATUS } from "@/constants/page/followStatus";
import { COLORS } from "@/constants/utils/colors";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

type Member = {
  id: number;
  name: string;
  username: string;
  isFollowed?: boolean;
};

export default function AllMember() {
  const insets = useSafeAreaInsets();

  // Contoh data member
  const [members, setMembers] = useState<Member[]>([
    {
      id: 1,
      name: "Balqis Muharda (Host)",
      username: "bacica",
      isFollowed: false,
    },
    { id: 2, name: "Alicia Felisha", username: "aliciaf", isFollowed: true },
    { id: 3, name: "Tasya Pandya", username: "tasya", isFollowed: false },
    { id: 4, name: "Bryan Cornelius", username: "bryanc", isFollowed: false },
    { id: 5, name: "Akbar Zaidan", username: "akbarz", isFollowed: true },
  ]);

  const toggleFollow = (id: number) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === id
          ? { ...member, isFollowed: !member.isFollowed }
          : member
      )
    );
  };

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
              onChangeText={(text) => console.log(text)}
              containerStyle={{ marginRight: 8 }}
            />

            <View className="gap-[32px] mt-6">
              {members.map((member) => (
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
                      className={`${
                        member.isFollowed ? "text-primary2nd" : "text-white"
                      }`}
                    >
                      {member.isFollowed
                        ? FOLLOWSTATUS.FOLLOWING
                        : FOLLOWSTATUS.FOLLOW}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
