import IconUpload from "@/components/ui/icon-upload";
import { CoverPickerProps } from "@/types/myroom/coverProps";
import * as ExpoImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function ImagePicker({
  label,
  imageUrl,
  onChangeImage,
  size = 120,
  onEdit = true,
}: CoverPickerProps) {
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    try {
      const permission =
        await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        alert("Permission to access gallery is required!");
        return;
      }

      const result = await ExpoImagePicker.launchImageLibraryAsync({
        mediaTypes: ExpoImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
      });

      if (!result.canceled) {
        onChangeImage(result.assets[0].uri);
      }
    } catch (err) {
      console.log("Image pick error:", err);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => onChangeImage("");

  return (
    <View className="mb-5">
      <Text className="text-lg font-medium text-[#171717] mb-2">
        {label} <Text className="text-[#EF4444]">*</Text>
      </Text>

      {imageUrl ? (
        <View className="relative">
          <Image
            source={{ uri: imageUrl }}
            className="w-full h-48 rounded-lg mb-2"
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
          className="border border-gray-300 rounded-lg py-6 flex items-center justify-center"
        >
          <IconUpload />
          <Text className="text-[#737373] mt-3">Add photo of your plan</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
