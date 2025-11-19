import { COLORS } from "@/constants/utils/colors";
import React from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onFilterPress: () => void;
  selectedFilter: string;
  onSearch?: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onFilterPress,
  selectedFilter,
  onSearch,
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

  const handleSubmitEditing = () => {
    onSearch?.(value);
  };

  return (
    <View
      className="p-3 border-b border-gray-200"
      style={{ backgroundColor: COLORS.white }}
    >
      <View className="flex-row items-center gap-2">
        <View
          className="flex-1 flex-row items-center rounded-lg px-3 py-2"
          style={{
            backgroundColor: COLORS.neutral100,
            borderColor: COLORS.neutral300,
          }}
        >
          <Image
            source={require("../../assets/directmessage/search.png")}
            className="h-5 w-5 mr-2"
          />
          <TextInput
            placeholder="Search"
            value={value}
            onChangeText={onChange}
            className="flex-1"
            style={{ color: COLORS.neutral900 }}
            placeholderTextColor={COLORS.neutral700}
            onSubmitEditing={handleSubmitEditing}
            returnKeyType="search"
          />
        </View>

        <TouchableOpacity
          onPress={onFilterPress}
          className="flex-row items-center rounded-lg px-3 py-2"
          style={{
            backgroundColor: COLORS.neutral100,
            borderColor: COLORS.neutral300,
          }}
          activeOpacity={0.7}
        >
          <Text className="text-sm mr-2" style={{ color: COLORS.neutral900 }}>
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
