import handleUpData from "@/hooks/useCloudinary";
import { CoverProps, FileProps } from "@/types/myroom/coverProps";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";

export function useRoomCover(
  initialImageUrl?: string,
  onChangeImage?: (url: string) => void
): CoverProps {
  const [image, setImage] = useState<string | null>(initialImageUrl || null);
  const [uploading, setUploading] = useState(false);
  
  const removeImage = () => {
  setImage(null);
  setUploading(false);
};

  useEffect(() => {
    if (initialImageUrl) setImage(initialImageUrl);
  }, [initialImageUrl]);

  const pickPhoto = async (type: "camera" | "gallery") => {
    try {
      console.log("testing");
      setUploading(true);
      let result: ImagePicker.ImagePickerResult;

      if (type === "camera") {
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      } else {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [1, 1],
          quality: 1,
        });
      }

      if (!result.canceled && result.assets[0]) {
        setUploading(true);

        const file: FileProps = {
          uri: result.assets[0].uri,
          type: "image/jpeg",
          name: `room-cover-${Date.now()}.jpg`,
        };

        setImage(file.uri);
        const cloudinaryUrl = await handleUpData(file);
        if (cloudinaryUrl) {
          setImage(cloudinaryUrl);
          onChangeImage?.(cloudinaryUrl);
        } else {
          throw new Error("Upload failed");
        }
      }
    } catch (err: any) {
      console.error(err);
      setImage(null);
      throw new Error(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  

  return { image, uploading, pickPhoto, removeImage };
}
