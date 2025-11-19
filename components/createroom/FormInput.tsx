import React from "react"
import { Platform, Text, TextInput, TextInputProps, View } from "react-native"

interface FormInputProps extends TextInputProps {
    label?: string
    value: string
    onChangeText: (text: string) => void
    placeholder?: string
    error?: string
    secureTextEntry?: boolean
    multiline?: boolean
    required?: boolean
    showRequiredMark?: boolean
    inputStyle?: object
    isNumeric?: boolean
    onEdit: boolean
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
    showRequiredMark = true,
    inputStyle = {},
    isNumeric = false,
    onEdit = false,
    ...rest
}: FormInputProps) {
    return (
        <View className="mb-4">
            {label && (
                <Text className="text-lg font-interMedium text-[#171717] mb-2">
                    {label}
                    {required && showRequiredMark && (
                        <Text className="text-[#EF4444]"> *</Text>
                    )}
                </Text>
            )}

            <TextInput
                className={`border rounded-xl px-4 text-base bg-white ${error ? "border-[#EF4444]" : "border-gray-300"}`}
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                multiline={multiline}
                keyboardType={isNumeric ? "number-pad" : "default"}
                textAlignVertical={multiline ? "top" : "center"}
                underlineColorAndroid="transparent"
                {...(Platform.OS === "android" && { cursorColor: "#0F172A" })}
                style={[
                    {
                        height: multiline ? undefined : 48,
                        minHeight: multiline ? 120 : 48,
                        fontSize: 16,
                        color: "#0F172A",
                        padding: 0,
                        paddingHorizontal: 16,
                        paddingVertical: multiline ? 12 : 0,
                        ...(Platform.OS === "android" && { includeFontPadding: false }),
                        ...(Platform.OS === "web" && { outlineStyle: "none" } as any),
                    },
                    inputStyle,
                ]}
                {...rest}
            />

            {error && <Text className="text-[#EF4444] text-sm mt-1">{error}</Text>}
        </View>
    )
}