import React from "react"
import { View, TextInput as RNTextInput, TouchableOpacity } from "react-native"
import { Eye, EyeOff } from "lucide-react-native"
import Text from "../ui/Text"

type TextInputProps = {
    label?: string
    placeholder?: string
    icon?: React.ReactNode
    secureTextEntry?: boolean
    showPasswordToggle?: boolean
    showPassword?: boolean
    setShowPassword?: (v: boolean) => void
    value: string
    onChangeText: (v: string) => void
    error?: string
    keyboardType?: "default" | "email-address" | "numeric" | "phone-pad"
}

export default function TextInput({
    label,
    placeholder,
    icon,
    secureTextEntry = false,
    showPasswordToggle = false,
    showPassword,
    setShowPassword,
    value,
    onChangeText,
    error,
    keyboardType = "default",
}: TextInputProps) {
    return (
        <View className="mb-2">
            {label && <Text className="text-[#404040] mb-1 font-semibold text-base">{label}</Text>}
            <View
                className={`flex-row items-center border rounded-lg bg-white h-14 px-3 ${error ? "border-red-500" : "border-gray-300"}`}
            >
                {icon && <View className="mr-2">{icon}</View>}
                <RNTextInput
                    className="flex-1 text-black bg-white text-base outline-none"
                    placeholder={placeholder}
                    secureTextEntry={secureTextEntry && !showPassword}
                    value={value}
                    onChangeText={onChangeText}
                    keyboardType={keyboardType}
                />
                {showPasswordToggle && setShowPassword && (
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="ml-2">
                        {showPassword ? <EyeOff size={20} color="gray" /> : <Eye size={20} color="gray" />}
                    </TouchableOpacity>
                )}
            </View>
            {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
        </View>
    )
}
