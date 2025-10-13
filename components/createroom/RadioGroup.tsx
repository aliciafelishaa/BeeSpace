import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface Option {
  label: string;
  value: string;
}

interface RadioGroupProps {
  label: string;
  options: Option[];
  selectedValue: string;
  onValueChange: (value: string) => void;
  error?: string;
  required?: boolean;
  onEdit: boolean;
}

export default function RadioGroup({
  label,
  options,
  selectedValue,
  onValueChange,
  error,
  required = false,
  onEdit = false,
}: RadioGroupProps) {
  return (
    <View className="mb-4">
      <Text className="text-lg font-interMedium text-[#171717] mb-2">
        {label}
        {required && <Text className="text-[#EF4444]"> *</Text>}
      </Text>

      <View className="flex-row flex-wrap gap-3">
        {options.map((option) => {
          const isSelected = selectedValue === option.value;
          return (
            <TouchableOpacity
              key={option.value}
              className={`flex-row items-center px-4 py-2 border rounded-xl
                                ${error ? "border-[#EF4444] bg-white" : isSelected ? "border-[#FFD661] bg-[#FDF9EB]" : "border-gray-300 bg-white"}`}
              onPress={() => onValueChange(option.value)}
            >
              <View
                className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                  error
                    ? "border-[#EF4444]"
                    : isSelected
                      ? "border-[#FFD661]"
                      : "border-gray-400"
                }`}
              >
                {isSelected && !error && (
                  <View className="w-4 h-4 bg-[#FFD661] rounded-full" />
                )}
              </View>

              <Text
                className={`ml-2 text-base ${error ? "text-[#EF4444] font-semibold" : isSelected ? "text-[#FFD661] font-semibold" : "text-gray-700"}`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {error && <Text className="text-[#EF4444] text-sm mt-1">{error}</Text>}
    </View>
  );
}
