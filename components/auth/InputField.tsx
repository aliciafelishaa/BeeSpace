import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Platform } from "react-native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Controller } from "react-hook-form";
import Text from "@/components/ui/Text";

type InputFieldProps = {
    label?: string;
    control: any;
    name: string;
    placeholder: string;
    rules?: object;
    icon?: keyof typeof Feather.glyphMap;
    type?: "text" | "password" | "textarea";
    error?: string;
    required?: boolean;
    onClearError?: () => void;
    maxLength?: number;
    numericOnly?: boolean;
    alphabeticOnly?: boolean;
    usernameOnly?: boolean;
};

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
    numericOnly = false,
    alphabeticOnly = false,
    usernameOnly = false,
}: InputFieldProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const borderColor = isFocused
        ? "#FCBC03"
        : error
            ? "#EF4444"
            : "#D1D5DB";

    const formatToTitleCase = (str: string) =>
        str
            ?.toLowerCase()
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ");

    const isTextarea = type === "textarea";

    return (
        <View className="mb-4">
            {label && (
                <Text weight="SemiBold" className="text-lg font-medium text-[#404040] mb-2">
                    {label} {required && <Text className="text-[#EF4444]">*</Text>}
                </Text>
            )}

            <View
                style={{
                    borderWidth: 1.5,
                    borderColor,
                    borderRadius: 12,
                    backgroundColor: "#FFFFFF",
                    paddingHorizontal: 12,
                    paddingVertical: isTextarea ? 10 : 0,
                    flexDirection: "row",
                    alignItems: isTextarea ? "flex-start" : "center",
                }}
            >
                {icon && !isTextarea && (
                    <Feather
                        name={icon}
                        size={20}
                        color="#64748B"
                        style={{ marginRight: 8, marginTop: isTextarea ? 6 : 0 }}
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
                                fontSize: 16,
                                color: "#0F172A",
                                padding: 0,
                                minHeight: isTextarea ? 100 : 50,
                                textAlignVertical: isTextarea ? "top" : "center",
                                ...(Platform.OS === "android" && { includeFontPadding: false }),
                                ...(Platform.OS === "web" && { outlineStyle: "none" } as any),
                            }}
                            multiline={isTextarea}
                            underlineColorAndroid="transparent"
                            secureTextEntry={type === "password" && !showPassword}
                            onBlur={() => {
                                setIsFocused(false);
                                onBlur();
                            }}
                            onFocus={() => setIsFocused(true)}
                            onChangeText={(text) => {
                                let filteredText = text;

                                if (numericOnly) {
                                    filteredText = text.replace(/[^0-9]/g, "");
                                } else if (alphabeticOnly) {
                                    filteredText = text.replace(/[^a-zA-Z\s]/g, "");
                                    filteredText = formatToTitleCase(filteredText);
                                } else if (usernameOnly) {
                                    filteredText = text.replace(/[^a-zA-Z0-9._]/g, "");
                                }

                                onChange(filteredText);
                                if (onClearError) onClearError();
                            }}
                            value={value}
                            autoCapitalize={alphabeticOnly ? "words" : "none"}
                            maxLength={maxLength}
                            keyboardType={numericOnly ? "numeric" : "default"}
                        />
                    )}
                />

                {type === "password" && (
                    <TouchableOpacity
                        onPress={() => setShowPassword(!showPassword)}
                        style={{ paddingLeft: 6 }}
                    >
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
    );
};
