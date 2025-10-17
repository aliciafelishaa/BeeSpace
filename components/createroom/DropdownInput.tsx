import { ChevronDown } from "lucide-react-native";
import React, { useState } from "react";
import { FlatList, Modal, Text, TouchableOpacity, View } from "react-native";

interface Option {
  label: string;
  value: string;
}

interface DropdownInputProps {
  label: string;
  options: Option[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  onEdit: boolean;
}

export default function DropdownInput({
  label,
  options,
  selectedValue,
  onValueChange,
  placeholder,
  error,
  required = false,
  onEdit = false,
}: DropdownInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || placeholder;

  return (
    <View className="mb-4">
      <Text className="text-lg font-interMedium text-[#171717] mb-2">
        {label}
        {required && <Text className="text-[#EF4444]"> *</Text>}
      </Text>

      <TouchableOpacity
        className={`flex-row justify-between items-center border rounded-xl px-4 py-3 bg-white ${error ? "border-[#EF4444]" : "border-gray-300"}`}
        onPress={() => setIsOpen(true)}
      >
        <Text
          className={`text-base ${selectedValue ? "text-gray-900" : "text-gray-400"}`}
        >
          {selectedLabel}
        </Text>
        <ChevronDown size={20} color="#555" />
      </TouchableOpacity>

      {error && <Text className="text-[#EF4444] text-sm mt-1">{error}</Text>}

      <Modal visible={isOpen} transparent animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/30 justify-center px-6"
          onPress={() => setIsOpen(false)}
          activeOpacity={1}
        >
          <View className="bg-white rounded-xl p-4">
            <FlatList
              data={options}
              keyExtractor={(item) => item.value}
              renderItem={({ item }) => (
                <TouchableOpacity
                  className="py-3 border-b border-gray-100"
                  onPress={() => {
                    onValueChange(item.value);
                    setIsOpen(false);
                  }}
                >
                  <Text className="text-base text-gray-800">{item.label}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
