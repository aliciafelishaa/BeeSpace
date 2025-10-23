import { COLORS } from "@/constants/utils/colors";
import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";

type Props = {
  label: string;
  value?: any;
  onFileSelected: (file: any) => void;
};

export function ProfileStudentCard({
  label,
  value,
  onFileSelected,
}: Props) {
  return (
    <View className="space-y-2">

      <Text
        style={{ fontFamily: "Inter_600SemiBold", color: COLORS.neutral900 }}
        className="text-[13px]"
      >
        {label}
        <Text className="text-[#EF4444]"> *</Text>
      </Text>

      {value ? (
        <View
          style={{
            height: 200,
            borderRadius: 12,
            overflow: "hidden", 
          }}
        >
          <Image
            source={{ uri: value.uri }} 
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />

          <TouchableOpacity
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0,0,0,0.5)",
              padding: 6,
              borderRadius: 20,
            }}
            onPress={() => alert("Button ganti gambar")}
          >

          </TouchableOpacity>
        </View>
      ) : (

        <View
          style={{
            borderWidth: 1,
            borderColor: COLORS.neutral300,
            backgroundColor: COLORS.white, 
            borderRadius: 12,
            borderStyle: "dashed", 
            padding: 20,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={require('@/assets/profile/icon-cloud.png')}
            style={{
              width: 48, 
              height: 48, 
            }}
            resizeMode="contain"
            ></Image>

          <Text
            style={{
              fontFamily: "Inter_400Regular",
              color: COLORS.neutral500,
              marginTop: 12,
              textAlign: "center",
            }}
          >
            Upload the picture of your Student ID Card
            {"\n"}
            <Text style={{ fontSize: 13 }}>
              Format: JPG, PNG (Max 5MB)
            </Text>
          </Text>

          <TouchableOpacity
            style={{
              backgroundColor: COLORS.primary2nd,
              paddingHorizontal: 24,
              paddingVertical: 10,
              borderRadius: 8,
              marginTop: 16,
            }}
            activeOpacity={0.8}
            onPress={() => alert("Ini button files")}
          >
            <Text
              style={{
                fontFamily: "Inter_600SemiBold",
                color: COLORS.white,
                fontSize: 14,
              }}
            >
              Select files
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}