import * as ExpoImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import { Image, TouchableOpacity } from "react-native";

interface ChatImagePickerProps {
  onImageSelected: (imageUri: string) => void;
}

export default function ChatImagePicker({
  onImageSelected,
}: ChatImagePickerProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const permission =
        await ExpoImagePicker.requestMediaLibraryPermissionsAsync();
      setHasPermission(permission.granted);
    })();
  }, []);

  const pickImage = async () => {
    try {
      if (hasPermission === false) {
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
        onImageSelected(result.assets[0].uri);
      }
    } catch (err) {
      console.log("Image pick error:", err);
    }
  };

  return (
    <TouchableOpacity onPress={pickImage} className="mr-2" activeOpacity={0.7}>
      <Image
        source={require("@/assets/directmessage/LogoImg.png")}
        className="w-6 h-6"
      />
    </TouchableOpacity>
  );
}
