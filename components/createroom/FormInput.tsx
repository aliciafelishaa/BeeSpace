import React from "react";
import { Text, TextInput, TextInputProps, View } from "react-native";

interface FormInputProps extends TextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  multiline?: boolean;
  required?: boolean;
  inputStyle?: object;
  isNumeric?: boolean;
}

export default function FormInput({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  multiline = false,
  required = false,
  inputStyle = {},
  isNumeric = false,
  ...rest
}: FormInputProps) {
  return (
    <View className="mb-4">
      {label && (
        <Text className="text-lg font-medium text-[#171717] mb-2">
          {label}
          {required && <Text className="text-[#EF4444]"> *</Text>}
        </Text>
      )}

      <TextInput
        className={`border rounded-xl px-4 py-3 text-base bg-white ${error ? "border-[#EF4444]" : "border-gray-300"}`}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        style={inputStyle}
        keyboardType={isNumeric ? "number-pad" : "default"}
        textAlignVertical={multiline ? "top" : "center"}
        {...rest}
      />

      {error && <Text className="text-[#EF4444] text-sm mt-1">{error}</Text>}
    </View>
  );
}
