import React, { useState } from "react"
import { View, Image, TouchableOpacity, Text } from "react-native"
import * as ExpoImagePicker from "expo-image-picker"
import IconUpload from "@/components/ui/icon-upload"

interface ImagePickerProps {
    label?: string
    value?: string | null
    onChange: (uri: string | null) => void
    required?: boolean
}

export default function ImagePicker({ label, value, onChange, required = false }: ImagePickerProps) {
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
        } finally {
            setUploading(false)
        }
    }

    const removeImage = () => onChange(null)

    return (
        <View className="mb-5">
            <Text className="text-lg font-medium text-[#171717] mb-2">
                {label} {required && <Text className="text-[#EF4444]">*</Text>}
            </Text>

            {value ? (
                <View className="relative">
                    <Image
                        source={{ uri: value }}
                        className="w-full h-48 rounded-lg mb-2"
                        resizeMode="cover"
                    />
                    <TouchableOpacity onPress={removeImage} className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded-md">
                        <Text className="text-white text-sm">Remove</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity onPress={pickImage} className="border border-gray-300 rounded-lg py-6 flex items-center justify-center">
                    <IconUpload/>
                    <Text className="text-[#737373] mt-3">Add photo of your plan</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}
