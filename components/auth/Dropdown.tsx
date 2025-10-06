import React, { useState } from "react"
import { View } from "react-native"
import { Dropdown } from "react-native-element-dropdown"
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

    const data = options.map((opt) => ({ label: opt, value: opt }))

    return (
        <View className="mb-2">
            {label && (
                <Text className="text-[#404040] mb-1 font-semibold text-base">{label}</Text>
            )}

            <Dropdown
                style={{
                    borderWidth: 1,
                    borderColor: error ? "#F87171" : isFocus ? "#FFD661" : "#D1D5DB", 
                    borderRadius: 8,
                    paddingHorizontal: 12,
                    height: 56,
                }}
                containerStyle={{ zIndex: 1000 }}
                placeholderStyle={{ color: value ? "#000" : "#888" }}
                selectedTextStyle={{ color: "#000" }}
                iconStyle={{ tintColor: "#000" }}
                data={data}
                labelField="label"
                valueField="value"
                value={value}
                placeholder={placeholder || "Select..."}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                onChange={(item) => {
                    onValueChange(item.value)
                    setIsFocus(false)
                }}
                search
                searchPlaceholder="Search..."
            />

            {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
        </View>
    )
}
