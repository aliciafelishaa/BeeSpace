import { FilterType } from "@/types/directmessage/dm";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

const filters: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "not-read", label: "Not Read" },
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  selectedFilter,
  onFilterChange,
}) => {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: SCREEN_HEIGHT,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen]);

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={onClose}
        />

        <View className="bg-white rounded-t-3xl">
          <View className="px-6 py-5">
            <Text className="text-xl font-bold text-[#F59E0B]">
              Choose Category
            </Text>
          </View>

          <View className="px-6">
            {filters.map((filter, index) => (
              <View key={filter.value}>
                <TouchableOpacity
                  onPress={() => onFilterChange(filter.value)}
                  className="flex-row items-center justify-between py-4"
                  activeOpacity={0.7}
                >
                  <Text className="text-base text-gray-900">
                    {filter.label}
                  </Text>
                  <View className="w-5 h-5 rounded-full border-2 border-gray-300 justify-center items-center">
                    {selectedFilter === filter.value && (
                      <View className="w-3 h-3 bg-[#F59E0B] rounded-full" />
                    )}
                  </View>
                </TouchableOpacity>
                {index < filters.length - 1 && (
                  <View className="h-px bg-gray-200" />
                )}
              </View>
            ))}
          </View>

          <View className="px-6 py-5 pb-8">
            <TouchableOpacity
              onPress={onClose}
              className="bg-[#F59E0B] py-3 rounded-xl active:opacity-80"
            >
              <Text className="text-white text-center font-semibold text-base">
                Terapkan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
