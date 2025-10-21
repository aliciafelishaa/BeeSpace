import { COLORS } from "@/constants/utils/colors";
import { NotificationFilter } from "@/types/notifications/notification";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Modal, Text, TouchableOpacity, View } from "react-native";

interface FilterProps {
  isOpen: boolean;
  onClose: () => void;
  selectedFilter: NotificationFilter;
  onFilterChange: (f: NotificationFilter) => void;
}

const OPTIONS: { value: NotificationFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
];

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const NotificationFilterModal: React.FC<FilterProps> = ({
  isOpen,
  onClose,
  selectedFilter,
  onFilterChange,
}) => {
  const slideY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (isOpen) {
      Animated.spring(slideY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideY, {
        toValue: SCREEN_HEIGHT,
        duration: 240,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen]); 

  return (
    <Modal
      visible={isOpen}
      transparent animationType="none" 
      onRequestClose={onClose}
    >
      <View 
        className="flex-1 justify-end" 
        style={{ backgroundColor: COLORS.neutral700 + "80" }}
      >
        <TouchableOpacity
          className="flex-1"
          activeOpacity={1}
          onPress={onClose}
        />
        <Animated.View
          className="rounded-t-3xl pb-6"
          style={{
            backgroundColor: COLORS.white,
            transform: [{ translateY: slideY }],
            overflow: "hidden",
          }}
        >
          <View className="px-6 py-5">
            <Text className="text-xl font-bold" 
            style={{ color: COLORS.primary2nd }}
            >
              Choose Filter
            </Text>
          </View>

          <View className="px-6">
            {OPTIONS.map((opt, idx) => (
              <View key={opt.value}>
                <TouchableOpacity
                  className="flex-row items-center justify-between py-4"
                  activeOpacity={0.7}
                  onPress={() => onFilterChange(opt.value)}
                >
                  <Text className="text-base" style={{ color: COLORS.neutral900 }}>
                    {opt.label}
                  </Text>

                  <Text
                    className="text-sm font-semibold"
                    style={{ color: selectedFilter === opt.value ? COLORS.primary2nd : "transparent" }}
                  >
                  </Text>
                </TouchableOpacity>

                {idx < OPTIONS.length - 1 && (
                  <View className="h-px" style={{ backgroundColor: COLORS.neutral300 }} />
                )}
              </View>
            ))}
          </View>

          <View className="px-6 pt-5 pb-8">
            <TouchableOpacity
              className="py-3 rounded-xl active:opacity-80"
              style={{ backgroundColor: COLORS.primary2nd }}
              onPress={onClose}
            >
              <Text className="text-white text-center font-semibold text-base">Apply</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};
