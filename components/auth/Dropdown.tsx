import React, { useState, useMemo } from "react";
import {
    View,
    TouchableOpacity,
    Modal,
    FlatList,
    TextInput,
    TouchableWithoutFeedback,
    Platform,
} from "react-native";
import Text from "@/components/ui/Text";

type DropdownProps = {
    label?: string;
    placeholder?: string;
    icon?: React.ReactNode;
    value: string;
    onValueChange: (v: string) => void;
    options: string[];
    error?: string;
    required?: boolean;
};

export default function SearchableDropdown({
    label,
    placeholder,
    icon,
    value,
    onValueChange,
    options,
    error,
    required,
}: DropdownProps) {
    const [isFocus, setIsFocus] = useState(false);
    const [search, setSearch] = useState("");

    const borderColor = isFocus
        ? "#FCBC03"
        : error
            ? "#EF4444"
            : "#D1D5DB";

    const filteredOptions = useMemo(
        () =>
            options.filter((opt) =>
                opt.toLowerCase().includes(search.toLowerCase())
            ),
        [options, search]
    );

    return (
        <View className="mb-4">
            {label && (
                <Text className="text-lg font-medium text-[#171717] mb-2">
                    {label} {required && <Text className="text-[#EF4444]">*</Text>}
                </Text>
            )}

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsFocus(true)}
                style={{
                    borderWidth: 1.5,
                    borderColor,
                    borderRadius: 12,
                    flexDirection: "row",
                    alignItems: "center",
                    backgroundColor: "#FFFFFF",
                    paddingHorizontal: 12,
                    height: 50,
                }}
            >
                <Text style={{ flex: 1, color: value ? "#0F172A" : "#9CA3AF", fontSize: 16 }}>
                    {value || placeholder || "Select..."}
                </Text>
                {icon}
            </TouchableOpacity>

            <Modal visible={isFocus} transparent animationType="fade">
                <View className="flex-1 justify-center px-6">
                    {/* Background overlay */}
                    <TouchableWithoutFeedback onPress={() => setIsFocus(false)}>
                        <View className="absolute inset-0 bg-black/30" />
                    </TouchableWithoutFeedback>

                    {/* Modal content */}
                    <View
                        style={{
                            backgroundColor: "#FFFFFF",
                            borderRadius: 12,
                            padding: 12,
                            maxHeight: "70%",
                            zIndex: 10,
                        }}
                    >
                        <TextInput
                            placeholder="Search..."
                            placeholderTextColor="#9CA3AF"
                            value={search}
                            onChangeText={setSearch}
                            style={{
                                borderWidth: 1,
                                borderColor: "#D1D5DB",
                                borderRadius: 12,
                                paddingHorizontal: 12,
                                height: 40,
                                marginBottom: 8,
                                color: "#0F172A",
                                ...(Platform.OS === "android" && { includeFontPadding: false }),
                                ...(Platform.OS === "web" && { outlineStyle: "none" } as any),
                            }}
                        />

                        <FlatList
                            keyboardShouldPersistTaps="handled"
                            data={filteredOptions}
                            keyExtractor={(item, index) => item + index}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => {
                                        onValueChange(item);
                                        setIsFocus(false);
                                        setSearch("");
                                    }}
                                    style={{ paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#E5E7EB" }}
                                >
                                    <Text className="text-black">{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </View>
            </Modal>

            {error && !isFocus && (
                <Text className="text-red-500 text-sm mt-1">{error}</Text>
            )}
        </View>
    );
}
