import React, { useState } from "react"
import { View, Image, TouchableOpacity, Text } from "react-native"
import * as ExpoImagePicker from "expo-image-picker"
import IconUpload from "@/components/ui/icon-upload"

interface StudentCardPickerProps {
    value?: string | null
    onChange: (uri: string | null) => void
    required?: boolean
}

export default function StudentCardPicker({ value, onChange, required = false }: StudentCardPickerProps) {
    const [uploading, setUploading] = useState(false)

    const pickImage = async () => {
        try {
            const permission = await ExpoImagePicker.requestMediaLibraryPermissionsAsync()
            if (!permission.granted) {
                alert("Permission to access gallery is required!")
                return
            }

            const result = await ExpoImagePicker.launchImageLibraryAsync({
                mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 0.7,
            })

            if (!result.canceled) {
                onChange(result.assets[0].uri)
            }
        } catch (err) {
            console.log("Image pick error:", err)
        }
    }

    const removeImage = () => onChange(null)

    return (
        <View className="mb-5">
            {value ? (
                <View className="relative w-full rounded-lg overflow-hidden">
                    <Image
                        source={{ uri: value }}
                        style={{ width: '100%', aspectRatio: 4 / 3 }}
                        resizeMode="cover"
                    />
                    <TouchableOpacity
                        onPress={removeImage}
                        className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded-md"
                    >
                        <Text className="text-white text-sm">Remove</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity
                    onPress={pickImage}
                    className="border-2 border-dashed border-gray-400 py-8 rounded-lg justify-center items-center mt-3 w-full"
                >
                    <IconUpload />
                    <Text className="text-center font-medium mt-3">
                        Upload the picture of your Student ID Card
                    </Text>
                    <Text className="text-sm text-gray-500 mt-1">Format: JPG, PNG (Max 5MB)</Text>
                    <Text className="bg-[#FCBC03] px-3 py-2 rounded text-[#FAFAFA] mt-2">Select files</Text>
                </TouchableOpacity>
            )}
        </View>

    )
}
