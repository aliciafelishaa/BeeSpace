import React from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type ModalFilteringDynamicProps = {
  visible: boolean;
  onClose: () => void;

  isJoin: boolean;
};

export default function ModalEditDelete({
  visible,
  onClose,
  isJoin = false,
}: ModalFilteringDynamicProps) {
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
              <TouchableOpacity className="flex flex-col gap-2 items-center justify-center">
                <Image
                  source={require("@/assets/images/copylink.png")}
                  className="w-[16px] h-[16px]"
                  resizeMode="cover"
                ></Image>
                <Text className="font-interMedium font-[16px]">Copy Link</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity className="flex flex-col gap-2 items-center justify-center">
              <Image
                source={require("@/assets/images/share.png")}
                className="w-[16px] h-[16px]"
                resizeMode="cover"
              ></Image>
              <Text className="font-interMedium font-[16px]">Share</Text>
            </TouchableOpacity>
            <TouchableOpacity className="flex flex-col gap-2 items-center justify-center">
              <Image
                source={require("@/assets/images/report.png")}
                className="w-[100px] h-[16px] "
                resizeMode="cover"
              ></Image>
              <Text className="font-interMedium font-[16px] text-error">
                Report
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}
