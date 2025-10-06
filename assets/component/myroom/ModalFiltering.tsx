import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ModalFilteringProps = {
  visible: boolean;
  onClose: () => void;
};

export default function ModalFiltering({
  visible,
  onClose,
}: ModalFilteringProps) {
  const [sortBy, setSortBy] = useState("Earliest Time");
  const [price, setPrice] = useState("Free");
  const [eventType, setEventType] = useState("Online");

  const resetFilter = () => {
    setSortBy("Earliest Time");
    setPrice("Free");
    setEventType("Online");
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />

      {/* Konten Modal */}
      <View
        className="
          absolute bottom-0 left-0 right-0
          bg-white rounded-t-xl
          max-h-[85%]
          px-6 pt-8 pb-8
        "
      >
        {/* Handle bar */}
        <View className="items-center mb-4">
          <View className="h-2 w-10 bg-neutral-700 rounded-full" />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {/* Sort By */}
          <Text className="font-semibold text-[16px] mt-2">Sort By</Text>
          {[
            "Earliest Time",
            "Nearest Location",
            "Most Popular",
            "Recently Added",
          ].map((item, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setSortBy(item)}
              className="flex-row justify-between items-center py-3"
            >
              <Text className="text-[14px]">{item}</Text>
              <View
                className={`w-5 h-5 rounded-full border-2 ${
                  sortBy === item ? "border-yellow-300" : "border-neutral-300"
                } items-center justify-center`}
              >
                {sortBy === item && (
                  <View className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                )}
              </View>
            </TouchableOpacity>
          ))}

          <View className="w-full h-[1px] bg-neutral-300 my-2" />

          {/* Price */}
          <Text className="font-semibold text-[16px] mt-2">Price</Text>
          {["Free", "Paid"].map((item, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setPrice(item)}
              className="flex-row justify-between items-center py-3"
            >
              <Text className="text-[14px]">{item}</Text>
              <View
                className={`w-5 h-5 rounded-full border-2 ${
                  price === item ? "border-yellow-400" : "border-neutral-300"
                } items-center justify-center`}
              >
                {price === item && (
                  <View className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                )}
              </View>
            </TouchableOpacity>
          ))}

          <View className="w-full h-[1px] bg-neutral-300 my-3" />

          {/* Event Type */}
          <Text className="font-semibold text-[16px] mt-2">Event Type</Text>
          {["Online", "Onsite"].map((item, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setEventType(item)}
              className="flex-row justify-between items-center py-3"
            >
              <Text className="text-[14px]">{item}</Text>
              <View
                className={`w-5 h-5 rounded-full border-2 ${
                  eventType === item
                    ? "border-yellow-400"
                    : "border-neutral-300"
                } items-center justify-center`}
              >
                {eventType === item && (
                  <View className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tombol bawah */}
        <View className="flex-row justify-between mt-5 gap-4">
          <TouchableOpacity
            onPress={resetFilter}
            className="flex-1 border border-yellow-400 py-3 rounded-[8px]"
          >
            <Text className="text-center text-yellow-400 font-semibold">
              Reset
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            className="flex-1 bg-yellow-400 py-3 rounded-[8px]"
          >
            <Text className="text-center text-white font-semibold">Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
