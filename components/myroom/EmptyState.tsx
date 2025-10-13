import { COLORS } from "@/constants/utils/colors";
import React from "react";
import { Image, ImageSourcePropType, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Variant = "upcoming" | "hosted" | "history";

type EmptyStateProps = {
  variant: Variant;
  title?: string;
  subtitle?: string;
  illustration?: ImageSourcePropType;
  width?: number;
  height?: number;
};

const DEFAULT_COPY: Record<Variant, { title: string; subtitle: string }> = {
  upcoming: {
    title: "You’re all caught up!",
    subtitle: "Let’s explore the room.",
  },
  hosted: {
    title: "There’s no room yet.",
    subtitle: "Create a new one!",
  },
  history: {
    title: "No history yet.",
    subtitle: "Rooms you’ve joined will appear here.",
  },
};

const VARIANT_ICONS: Record<Variant, any> = {
  upcoming: require("@/assets/utils/active-icon/globe.svg"),
  hosted: require("@/assets/utils/active-icon/hobby.svg"),
  history: require("@/assets/utils/active-icon/events.svg"),
};

export default function EmptyState({
  variant,
  title,
  subtitle,
  illustration,
  width = 120,
  height = 120,
}: EmptyStateProps) {
  const copy = DEFAULT_COPY[variant];
  const icon = VARIANT_ICONS[variant];
  const insets = useSafeAreaInsets(); 

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingBottom: insets.bottom + 100,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="items-center px-6 py-10">
        <View
          className="mb-4 rounded-xl flex items-center justify-center"
          style={{ width: width + 60, height: height + 40 }}
        >
          <Image
          source={illustration ?? icon}
          style={{
            width,
            height,
            tintColor: COLORS.primary,
          }}
          resizeMode="contain"
          />
        </View>

        <Text className="text-amber-700 text-[20px] font-semibold text-center">
        {title ?? copy.title}
        </Text>

        <Text className="text-neutral-500 text-[13px] mt-2 text-center">
          {subtitle ?? copy.subtitle}
        </Text>
      </View>
    </ScrollView>
  );
}
