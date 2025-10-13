import React, { useState, useMemo, useEffect } from "react"
import {
    View,
    TouchableOpacity,
    Modal,
    FlatList,
    TextInput,
    TouchableWithoutFeedback,
    Platform,
    KeyboardAvoidingView,
} from "react-native"
import Text from "@/components/ui/Text"

type DropdownProps = {
    label?: string
    placeholder?: string
    icon?: React.ReactNode
    value: string
    onValueChange: (v: string) => void
    options: string[]
    error?: string
    required?: boolean
    onClearError?: () => void
}

export const SearchableDropdown = ({
    label,
    placeholder,
    icon,
    value,
    onValueChange,
    options,
    error,
    required,
    onClearError,
}: DropdownProps) => {
    const [isFocus, setIsFocus] = useState(false)
    const [search, setSearch] = useState("")

    useEffect(() => {
        if (!isFocus) setSearch("")
    }, [isFocus])

    const borderColor = isFocus ? "#FCBC03" : error ? "#EF4444" : "#D1D5DB"

    const filteredOptions = useMemo(
        () => options.filter((opt) => opt.toLowerCase().includes(search.toLowerCase())),
        [options, search]
    )

    const handleSelect = (item: string) => {
        onValueChange(item)
        setIsFocus(false)
        setSearch("")
        onClearError?.()
    }

    const handleSearchChange = (text: string) => {
        setSearch(text)
        if (onClearError) onClearError()
    }

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

            <Modal visible={isFocus} transparent animationType="slide">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : undefined}
                    style={{ flex: 1 }}
                >
                    <TouchableWithoutFeedback onPress={() => setIsFocus(false)}>
                        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }} />
                    </TouchableWithoutFeedback>

                    <View
                        style={{
                            backgroundColor: "#FFFFFF",
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                            padding: 16,
                            maxHeight: "70%",
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                        }}
                    >
                        <TextInput
                            placeholder="Search..."
                            placeholderTextColor="#9CA3AF"
                            value={search}
                            onChangeText={handleSearchChange}
                            style={{
                                borderWidth: 1.5,
                                borderColor: "#D1D5DB",
                                borderRadius: 12,
                                paddingHorizontal: 15,
                                paddingVertical: 20,
                                height: 50,
                                marginBottom: 12,
                                fontSize: 16,
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
                                    onPress={() => handleSelect(item)}
                                    style={{
                                        paddingVertical: 12,
                                        paddingHorizontal: 8,
                                        borderBottomWidth: 1,
                                        borderBottomColor: "#E5E7EB",
                                        borderRadius: 8,
                                    }}
                                >
                                    <Text style={{ color: "#0F172A", fontSize: 16 }}>{item}</Text>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                </KeyboardAvoidingView>
            </Modal>

            {error && !isFocus && (
                <Text className="text-red-500 text-sm mt-1">{error}</Text>
            )}
        </View>
    )
}
