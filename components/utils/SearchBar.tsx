import React from "react"
import {
    Image,
    Platform,
    TextInput,
    TouchableOpacity,
    View,
    ViewStyle,
} from "react-native"
import { Search } from "@/components/ui/IconDash";

type SearchBarProps = {
    placeholder?: string
    containerStyle?: ViewStyle
    onChangeText?: (text: string) => void
    onSearch?: (text: string) => void
    value?: string
}

export default function SearchBar({
    placeholder = "Search",
    containerStyle,
    onChangeText,
    onSearch,
    value,
}: SearchBarProps) {
    return (
        <View
            style={[
                {
                    flexDirection: "row",
                    alignItems: "center",
                    borderWidth: 1,
                    borderColor: "#D1D5DB",
                    borderRadius: 12,
                    height: 48,
                    backgroundColor: "#FFFFFF",
                    paddingHorizontal: 12,
                },
                containerStyle,
            ]}
        >

            <TextInput
                placeholder={placeholder}
                placeholderTextColor="#9CA3AF"
                style={{
                    flex: 1,
                    fontSize: 16,
                    color: "#0F172A",
                    height: 48,
                    padding: 0,
                    ...(Platform.OS === "android" && { includeFontPadding: false }),
                    ...(Platform.OS === "web" && { outlineStyle: "none" } as any),
                }}
                underlineColorAndroid="transparent"
                {...(Platform.OS === "android" && { cursorColor: "#0F172A" })}
                value={value}
                onChangeText={(text) => {
                    onChangeText?.(text)
                }}
                onSubmitEditing={() => onSearch?.(value || "")}
                returnKeyType="search"
            />

            {onSearch && (
                <TouchableOpacity
                    onPress={() => onSearch(value || "")}
                    style={{ padding: 4 }}
                >
                    <Search />
                </TouchableOpacity>
            )}
        </View>
    )
}