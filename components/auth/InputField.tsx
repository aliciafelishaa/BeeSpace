import React, { useState } from "react"
import { View, TextInput, TouchableOpacity, Platform } from "react-native"
import { Feather, Ionicons } from "@expo/vector-icons"
import { Controller } from "react-hook-form"
import Text from "@/components/ui/Text"

type InputFieldProps = {
    label?: string
    control: any
    name: string
    placeholder: string
    rules?: object
    icon?: keyof typeof Feather.glyphMap
    type?: "text" | "password"
    error?: string
    required?: boolean
    onClearError?: () => void
    maxLength?: number
    numericOnly?: boolean
}

export const InputField = ({
    label,
    control,
    name,
    placeholder,
    rules,
    icon,
    type = "text",
    error,
    required,
    onClearError,
    maxLength,
    numericOnly = false, // default false
}: InputFieldProps) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const borderColor = isFocused ? "#FCBC03" : error ? "#EF4444" : "#D1D5DB"

    return (
        <View className="mb-4">
            {label && (
                <Text weight="Medium" className="text-lg font-medium text-[#171717] mb-2">
                    {label} {required && <Text className="text-[#EF4444]">*</Text>}
                </Text>
            )}

            <View
                style={{
                    borderWidth: 1.5,
                    borderColor,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#FFFFFF",
                    paddingHorizontal: 12,
                }}
            >
                {icon && (
                    <Feather
                        name={icon}
                        size={20}
                        color="#64748B"
                        style={{ marginRight: 8 }}
                    />
                )}

                <Controller
                    control={control}
                    name={name}
                    rules={rules}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            placeholder={placeholder}
                            placeholderTextColor="#9CA3AF"
                            style={{
                                flex: 1,
                                height: 50,
                                fontSize: 16,
                                color: "#0F172A",
                                padding: 0,
                                ...(Platform.OS === "android" && { includeFontPadding: false }),
                                ...(Platform.OS === "web" && { outlineStyle: "none" } as any),
                            }}
                            underlineColorAndroid="transparent"
                            selectionColor="transparent"
                            cursorColor="#0F172A"
                            secureTextEntry={type === "password" && !showPassword}
                            onBlur={() => {
                                setIsFocused(false)
                                onBlur()
                            }}
                            onFocus={() => setIsFocused(true)}
                            onChangeText={(text) => {
                                const filteredText = numericOnly ? text.replace(/[^0-9]/g, "") : text
                                onChange(filteredText)
                                if (onClearError) onClearError()
                            }}
                            value={value}
                            autoCapitalize="none"
                            maxLength={maxLength}
                            keyboardType={numericOnly ? "numeric" : "default"}
                        />
                    )}
                />

                {type === "password" && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                        <Ionicons
                            name={showPassword ? "eye-off" : "eye"}
                            size={20}
                            color="#64748B"
                        />
                    </TouchableOpacity>
                )}
            </View>

            {error && !isFocused && (
                <Text className="text-red-500 text-sm mt-1">{error}</Text>
            )}
        </View>
    )
}