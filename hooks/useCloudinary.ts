import { FileProps } from "@/types/myroom/coverProps";
import cloudinaryConfig from "../config/cloudinaryConfig";

const handleUpData = async (
  file: FileProps,
  preset?: string
): Promise<string | null> => {
  const data = new FormData();
  let fileToUpload: any;

  if (file.uri.startsWith("blob:")) {
    const blob = await fetch(file.uri).then((r) => r.blob());
    fileToUpload = new File([blob], file.name || "upload.jpg", {
      type: file.type || "image/jpeg",
    });
  } else {
    fileToUpload = {
      uri: file.uri,
      name: file.name || "upload.jpg",
      type: file.type || "image/jpeg",
    };
  }

  data.append("file", fileToUpload as any);
  data.append(
    "upload_preset",
    preset || (cloudinaryConfig.uploadPreset as any)
  );

  try {
    console.log("debug 1:", cloudinaryConfig);
    console.log("debug 2:", file);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`,
      {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok || !result.secure_url) {
      throw new Error(
        "Upload Error",
        result.error?.message || "Failed to upload image."
      );
    }

    return result.secure_url;
  } catch (error: any) {
    throw new Error("Upload Error", error);
  }
};

export default handleUpData;
