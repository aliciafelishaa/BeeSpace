import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type FilterOption = {
  title: string;
  options: string[];
};

type ModalFilteringDynamicProps = {
  visible: boolean;
  onClose: () => void;
  filters: FilterOption[]; // contoh: [{ title: "Price", options: ["Free","Paid"] }]
  initialValues?: Record<string, string>; // optional default values
};

export default function ModalFilteringDynamic({
  visible,
  onClose,
  filters,
  initialValues = {},
}: ModalFilteringDynamicProps) {
  // Dynamically create state for each filter
  const [selected, setSelected] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    filters.forEach((f) => {
      init[f.title] = initialValues[f.title] || f.options[0];
    });
    return init;
  });

  const resetFilter = () => {
    const reset: Record<string, string> = {};
    filters.forEach((f) => {
      reset[f.title] = f.options[0];
    });
    setSelected(reset);
  };

  const handleSelect = (filterTitle: string, option: string) => {
    setSelected((prev) => ({ ...prev, [filterTitle]: option }));
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
      <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[85%] px-6 pt-8 pb-14">
        {/* Handle bar */}
        <View className="items-center mb-4">
          <View className="h-1 w-14 bg-neutral-500 rounded-full" />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          {filters.map((filter, idx) => (
            <View key={idx}>
              <Text className="font-semibold text-[16px] mt-2 font-inter">
                {filter.title}
              </Text>
              {filter.options.map((opt, i) => (
                <TouchableOpacity
                  key={i}
                  onPress={() => handleSelect(filter.title, opt)}
                  className="flex-row justify-between items-center py-[10px]"
                >
                  <Text className="text-[14px] font-inter">{opt}</Text>
                  <View
                    className={`w-5 h-5 rounded-full border-2 ${
                      selected[filter.title] === opt
                        ? "border-yellow-400"
                        : "border-neutral-300"
                    } items-center justify-center`}
                  >
                    {selected[filter.title] === opt && (
                      <View className="w-2.5 h-2.5 rounded-full bg-primary2nd" />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
              <View className="w-full h-[1px] bg-neutral-300 my-2" />
            </View>
          ))}
        </ScrollView>

        {/* Tombol bawah */}
        <View className="flex-row justify-between mt-5 gap-4">
          <TouchableOpacity
            onPress={resetFilter}
            className="flex-1 border border-yellow-400 py-3 rounded-[8px] bg-primary4th"
          >
            <Text className="text-center text-primary2nd font-medium font-inter">
              Reset
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            className="flex-1 bg-primary2nd py-3 rounded-[8px]"
          >
            <Text className="text-center text-white font-medium font-inter">
              Apply
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
