import { COLORS } from "@/constants/utils/colors"
import React from "react"
import { Text, TextInput, TextInputProps, View } from "react-native"

type Props = TextInputProps & {
    label: string
    required?: boolean
    error?: boolean
    errorMessage?: string
    containerClassName?: string
    textClassName?: string
}

export function ProfileField({
    label,
    required,
    error = false,
    errorMessage,
    containerClassName = "",
    textClassName = "",
    onChangeText,
    ...props
}: Props) {
    return (
        <View className={`space-y-1 ${containerClassName}`}>
            <Text
                className="text-[13px]"
                style={{
                    fontFamily: "Inter_600SemiBold",
                    color: error ? COLORS.error : COLORS.neutral900,
                }}
            >
                {label} {required && <Text style={{ color: COLORS.error }}>*</Text>}
            </Text>

            <TextInput
                className={`rounded-xl px-4 py-3 text-[15px] ${textClassName}`}
                style={{
                    borderWidth: 1,
                    borderColor: error ? COLORS.error : COLORS.neutral300,
                    backgroundColor: COLORS.white,
                    color: COLORS.neutral900,
                    fontFamily: "Inter_400Regular",
                }}
                placeholderTextColor={COLORS.neutral500}
                onChangeText={(text) => {
                    if (onChangeText) onChangeText(text)
                }}
                {...props}
            />

            {error && errorMessage && (
                <Text
                    style={{
                        fontFamily: "Inter_400Regular",
                        fontSize: 12,
                        color: COLORS.error,
                        marginTop: 2,
                    }}
                >
                    {errorMessage}
                </Text>
            )}
        </View>
    )
}
