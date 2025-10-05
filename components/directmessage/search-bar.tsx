import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFilterPress: () => void;
  selectedFilter: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onFilterPress,
  selectedFilter,
}) => {
  const getFilterLabel = (filter: string) => {
    switch (filter) {
      case "all":
        return "All";
      case "not-read":
        return "Not Read";
      case "newest":
        return "Newest";
      case "oldest":
        return "Oldest";
      default:
        return "All";
    }
  };

  return (
    <View className="p-3 border-b border-gray-200 bg-white">
      <View className="flex-row items-center gap-2">
        <View className="flex-1 flex-row items-center bg-[#F4F4F4] border border-gray-300 rounded-lg px-3 py-2">
          <Image
            source={require("../../assets/directmessage/search.png")}
            className="h-5 w-5 mr-2"
          />
          <TextInput
            placeholder="Search"
            value={value}
            onChangeText={onChange}
            className="flex-1 text-neutral-900"
            placeholderTextColor="#171717"
          />
        </View>

        <TouchableOpacity
          onPress={onFilterPress}
          className="flex-row items-center bg-[#F4F4F4] border border-gray-300 rounded-lg px-3 py-2"
          activeOpacity={0.7}
        >
          <Text className="text-neutral-900 text-sm mr-2">
            {getFilterLabel(selectedFilter)}
          </Text>
          <Image
            source={require("../../assets/directmessage/arrow-down.png")}
            className="h-4 w-4"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};
