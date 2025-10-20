import { COLORS } from "@/constants/utils/colors";
import React, { useMemo, useState } from "react";
import {
  LayoutChangeEvent,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ProfileField } from "./ProfileField";
import { ProfileStudent } from "./ProfileStudent";
import { ProfileStudentCard } from "./ProfileStudentCard";

export type StudentFormValues = {
  universityName?: string;
  major?: string;
  studentId?: string;
  enrollmentYear?: string;
  graduationYear?: string;
  studentIdCard?: any; 
};

type Props = {
  initial?: Partial<StudentFormValues>;
  onSave?: (v: StudentFormValues) => void;
  onCancel?: () => void;
  loading?: boolean;
};

export function StudentInformationForm({
  initial,
  onSave,
  onCancel,
  loading = false,
}: Props) {
  const insets = useSafeAreaInsets();
  
  const [form, setForm] = useState<StudentFormValues>({
    universityName: initial?.universityName ?? "",
    major: initial?.major ?? "",
    studentId: initial?.studentId ?? "",
    enrollmentYear: initial?.enrollmentYear ?? "",
    graduationYear: initial?.graduationYear ?? "",
    studentIdCard: initial?.studentIdCard,
  });

  const [footerHeight, setFooterHeight] = useState(150);

  const canSave = useMemo(
    () =>
      form.universityName &&
      form.major &&
      form.studentId &&
      form.enrollmentYear &&
      form.graduationYear &&
      form.studentIdCard,
    [form]
  );

  const update =
    (k: keyof StudentFormValues) =>
    (v: string | any) =>
      setForm((s) => ({ ...s, [k]: v }));

  return (
    <View style={{ flex: 1, minHeight: 0, position: "relative" }}>
      <ScrollView
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: footerHeight,
          ...(Platform.OS === "web" ? { overflowY: "auto" as any } : {}),
        }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={{ gap: 16 }}>
          
          <ProfileStudent
            label="University's Name"
            required
            value={form.universityName}
            placeholder="Select university"
            onValueChange={update("universityName")}
          />

          <ProfileStudent
            label="Major"
            required
            value={form.major}
            placeholder="Select major"
            onValueChange={update("major")}
          />

          <ProfileField
            label="Student ID"
            required
            value={form.studentId}
            onChangeText={update("studentId")}
            keyboardType="number-pad"
            placeholder="Enter your student ID"
          />

          <View style={{ flexDirection: "row", gap: 16 }}>
            <View style={{ flex: 1 }}>
              <ProfileStudent
                label="Enrollment Year"
                required
                value={form.enrollmentYear}
                placeholder="Year"
                onValueChange={update("enrollmentYear")}
              />
            </View>
            <View style={{ flex: 1 }}>
              <ProfileStudent
                label="Year of Graduation"
                required
                value={form.graduationYear}
                placeholder="Year"
                onValueChange={update("graduationYear")}
              />
            </View>
          </View>

          <ProfileStudentCard
            label="Student ID Card"
            value={form.studentIdCard}
            onFileSelected={update("studentIdCard")}
          />

        </View>
      </ScrollView>

      <View
        onLayout={(event: LayoutChangeEvent) => {
          const { height } = event.nativeEvent.layout;
          if (height > 0 && height !== footerHeight) {
            setFooterHeight(height);
          }
        }}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: insets.bottom + 12,
          backgroundColor: COLORS.white,
          borderTopWidth: 1,
          borderTopColor: COLORS.neutral100,
        }}
      >
        <TouchableOpacity
          disabled={!canSave || loading}
          onPress={() => canSave && !loading && onSave?.(form)}
          style={{
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: "center",
            backgroundColor: canSave && !loading ? COLORS.primary2nd : `${COLORS.primary3rd}99`,
            marginBottom: 12,

          }}
        >
          <Text style={{ fontFamily: "Inter_600SemiBold", color: COLORS.white }}>
            {loading ? "Saving your changes.." : "Save Changes"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onCancel}
          disabled={loading}
          style={{
            borderRadius: 16,
            paddingVertical: 16,
            alignItems: "center",
            borderWidth: 1,
            borderColor: COLORS.primary2nd,
            backgroundColor: COLORS.white,
          }}
        >
          <Text style={{ fontFamily: "Inter_600SemiBold", color: COLORS.primary2nd }}>
            Cancel
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

