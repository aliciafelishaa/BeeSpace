import { reportRoomApi } from "@/services/room.service";
import * as Clipboard from "expo-clipboard";
import React from "react";
import {
  Alert,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";

type ModalFilteringDynamicProps = {
  visible: boolean;
  onClose: () => void;
  isJoin: boolean;
  isEdit: boolean;
  isReport: boolean;
  roomId: string;
  onDelete?: () => void;
};

export default function ModalEditDelete({
  visible,
  onClose,
  isJoin = false,
  isEdit = false,
  isReport = false,
  onDelete,
  roomId,
}: ModalFilteringDynamicProps) {
  const handleDelete = () => {
    console.log("test");
    Alert.alert("Delete Room", "Are you sure you want to delete this room?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: onDelete },
    ]);
  };

  const handleCopyLink = async () => {
    const link = `https://myapp.local/room/${roomId}`;
    await Clipboard.setStringAsync(link);

    if (Platform.OS === "android") {
      ToastAndroid.show("Link copied to clipboard!", ToastAndroid.SHORT);
    } else {
      Alert.alert("Copied!", "Link copied to clipboard!");
    }
  };

  const handleReport = () => {
    Alert.alert("Report Room", "Are you sure you want to report this room?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Report",
        style: "destructive",
        onPress: async () => {
          try {
            await reportRoomApi(roomId);
            Alert.alert("Reported!", "Thank you for reporting.");
          } catch (err) {
            Alert.alert("Error", "Failed to report room.");
          }
        },
      },
    ]);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <Pressable className="flex-1 bg-black/40" onPress={onClose} />

      {/* Konten Modal */}
      <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-xl max-h-[85%] px-6 pt-8 pb-14">
        {/* Handle bar */}
        <View className="items-center mb-4">
          <View className="h-1 w-14 bg-neutral-500 rounded-full" />
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
        >
          <View className="flex-row items-center justify-center gap-8 mt-4">
            {isJoin && (
              <TouchableOpacity
                className="flex flex-col gap-2 items-center justify-center"
                onPress={handleCopyLink}
              >
                <Image
                  source={require("@/assets/images/copylink.png")}
                  className="w-[48px] h-[48px]"
                  resizeMode="cover"
                ></Image>
                <Text className="font-interMedium font-[16px]">Copy Link</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity className="flex flex-col gap-2 items-center justify-center">
              <Image
                source={require("@/assets/images/share.png")}
                className="w-[48px] h-[48px]"
                resizeMode="cover"
              ></Image>
              <Text className="font-interMedium font-[16px]">Share</Text>
            </TouchableOpacity>
            {isReport && (
              <TouchableOpacity
                className="flex flex-col gap-2 items-center justify-center"
                onPress={handleReport}
              >
                <Image
                  source={require("@/assets/images/report.png")}
                  className="w-[48px] h-[48px]"
                  resizeMode="cover"
                ></Image>
                <Text className="font-interMedium font-[16px] text-error">
                  Report
                </Text>
              </TouchableOpacity>
            )}
            {isEdit && (
              <TouchableOpacity
                className="flex flex-col gap-2 items-center justify-center"
                onPress={onDelete}
              >
                <Image
                  source={require("@/assets/images/delete.png")}
                  className="w-[48px] h-[48px]"
                  resizeMode="cover"
                ></Image>
                <Text className="font-interMedium font-[16px]">Delete</Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
