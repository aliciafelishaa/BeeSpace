import React from "react"
import { View, Image, TouchableOpacity, Text, Platform } from "react-native"
import * as ExpoImagePicker from "expo-image-picker"
import IconUpload from "@/components/ui/icon-upload"
import { Ionicons } from "@expo/vector-icons"

type ImageProps = {
    value?: string | null
    onChange: (uri: string | null) => void
    required?: boolean
    shape?: "circle" | "square"
    showText?: boolean
}

export default function ImagePicker({
    value,
    onChange,
    required = false,
    shape = "square",
    showText = true
}: ImageProps) {

    const ID_CARD_ASPECT_RATIO: [number, number] = [16, 10]

    const pickImage = async () => {
        try {
            const permission = await ExpoImagePicker.requestMediaLibraryPermissionsAsync()
            if (!permission.granted) {
                console.error("Permission to access gallery is required!")
                return
            }

            const result = await ExpoImagePicker.launchImageLibraryAsync({
                mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: shape === "circle" ? [1, 1] : ID_CARD_ASPECT_RATIO,
                quality: 0.7,
            })

            if (!result.canceled) {
                onChange(result.assets[0].uri)
            }
        } catch (err) {
            console.error("Image pick error:", err)
        }
    }

    const removeImage = () => onChange(null)

    const isCircle = shape === "circle"

    const CircleUI = (
        <View className="w-64 h-64 relative items-center justify-center">

            <View className="w-48 h-48 rounded-full relative items-center justify-center overflow-hidden">
                <TouchableOpacity
                    onPress={value ? pickImage : undefined}
                    disabled={!value}
                    activeOpacity={0.7}
                    className={`w-full h-full justify-center items-center ${value ? 'border-0' : 'border-2 border-dashed border-gray-400 bg-gray-100'} rounded-full`}
                >
                    {value ? (
                        <Image
                            source={{ uri: value }}
                            className="w-full h-full rounded-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <TouchableOpacity
                            onPress={pickImage}
                            className="w-full h-full justify-center items-center"
                        >
                            <IconUpload />
                        </TouchableOpacity>
                    )}
                </TouchableOpacity>
            </View>

            {value && (
                <>
                    <TouchableOpacity 
                        onPress={removeImage} 
                        className="absolute z-10 bottom-8 left-12 bg-red-500 w-10 h-10 rounded-lg items-center justify-center border-white shadow-md"
                    >
                        <Ionicons name="trash-outline" size={18} color="white" />
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                        onPress={pickImage} 
                        className="absolute z-10 bottom-8 right-12 bg-[#FCBC03] w-10 h-10 rounded-lg items-center justify-center border-white shadow-md"
                    >
                        <Ionicons name="pencil-outline" size={18} color="white" />
                    </TouchableOpacity>
                </>
            )}
        </View>
    )

    const SquareUI = (
        <View className="w-full aspect-[16/10] rounded-lg relative overflow-hidden">
            <TouchableOpacity
                onPress={value ? pickImage : undefined}
                disabled={!value}
                activeOpacity={0.7}
                className={`w-full h-full justify-center items-center rounded-lg ${value ? 'border-0' : 'border-2 border-dashed border-gray-400 bg-gray-100'}`}
            >
                {value ? (
                    <Image
                        source={{ uri: value }}
                        className="w-full h-full rounded-lg"
                        resizeMode="cover"
                    />
                ) : (
                    <TouchableOpacity
                        onPress={pickImage}
                        className="w-full h-full justify-center items-center"
                    >
                        <IconUpload />
                        {showText && (
                            <View className="items-center mt-3">
                                <Text className="text-center font-medium text-sm text-[#404040]">
                                    Upload the picture of your Student ID Card
                                </Text>
                                <Text className="text-xs text-gray-500 mt-1">Format: JPG, PNG (Max 5MB)</Text>
                                <View className="bg-[#FCBC03] px-3 py-2 rounded mt-2">
                                    <Text className="text-[#FAFAFA] text-sm">Select files</Text>
                                </View>
                            </View>
                        )}
                    </TouchableOpacity>
                )}
            </TouchableOpacity>

            {value && (
                <View className="absolute bottom-2 right-2 z-10 flex-row space-x-2">
                    <TouchableOpacity
                        onPress={removeImage}
                        className="bg-red-500 p-2 rounded-lg items-center justify-center shadow-md"
                    >
                        <Ionicons name="trash-outline" size={18} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={pickImage}
                        className="bg-[#FCBC03] p-2 rounded-lg items-center justify-center shadow-md"
                    >
                        <Ionicons name="pencil-outline" size={18} color="white" />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )

    return (
        <View className={`mb-5 ${isCircle ? 'items-center' : 'items-stretch'}`}>
            {isCircle ? CircleUI : SquareUI}

            {required && !value && (
                <Text className="text-red-500 text-sm mt-2">Required</Text>
            )}
        </View>
    )
}