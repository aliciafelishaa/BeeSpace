import React, { useState } from "react"
import {
    View,
    TouchableOpacity,
    Modal,
    FlatList,
    TextInput,
    TouchableWithoutFeedback,
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
}

export default function SearchableDropdown({
    label,
    placeholder,
    icon,
    value,
    onValueChange,
    options,
    error,
}: DropdownProps) {
    const [isFocus, setIsFocus] = useState(false)
    const [search, setSearch] = useState("")

    const filteredOptions = options.filter((opt) =>
        opt.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <View className="mb-2">
            {label && (
                <Text className="text-[#404040] mb-1 font-semibold text-base">
                    {label}
                </Text>
            )}

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setIsFocus(true)}
                className="flex-row justify-between items-center border rounded-lg px-3 h-14"
                style={{
                    borderColor: error ? "#F87171" : isFocus ? "#FFD661" : "#D1D5DB",
                    borderWidth: 1,
                }}
            >
                <Text className={value ? "text-black" : "text-gray-400"}>
                    {value || placeholder || "Select..."}
                </Text>
                {icon}
            </TouchableOpacity>

            {/* Modal Dropdown */}
            <Modal
                visible={isFocus}
                transparent
                animationType="fade"
                onRequestClose={() => setIsFocus(false)}
            >
                <TouchableWithoutFeedback onPress={() => setIsFocus(false)}>
                    <View className="flex-1 bg-black/30 justify-center px-6">
                        <View className="bg-white rounded-xl p-4 max-h-[70%]">
                            <TextInput
                                placeholder="Search..."
                                value={search}
                                onChangeText={setSearch}
                                className="border border-gray-300 rounded-lg px-3 py-2 mb-3"
                            />
                            <FlatList
                                data={filteredOptions}
                                keyExtractor={(item) => item}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        onPress={() => {
                                            onValueChange(item)
                                            setIsFocus(false)
                                            setSearch("")
                                        }}
                                        className="py-3 border-b border-gray-200"
                                    >
                                        <Text className="text-black">{item}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>

            {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
        </View>
    )
}
