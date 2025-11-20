import Text from "@/components/ui/Text";
import { auth } from "@/config/firebaseConfig";
import { COLORS } from "@/constants/utils/colors";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, TouchableOpacity, View } from "react-native";

export default function ChangePassword({ email }: { email: string }) {
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const handleSendVerification = async () => {
    if (!email) return;

    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", "We have sent a verification to your email.");

      setCountdown(30);
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let timer: any;

    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    }

    return () => clearTimeout(timer);
  }, [countdown]);

  return (
    <View style={{ padding: 24, marginTop: 40 }}>
      <Text className="text-2xl font-bold mb-2 text-center">
        Verify Your Email
      </Text>
      <Text className="text-[#666] text-center mb-8 px-4">
        To continue updating your password, we need to verify your identity.
      </Text>

      <View
        style={{
          backgroundColor: "#fff",
          padding: 20,
          borderRadius: 16,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 3,
          marginBottom: 30,
        }}
      >
        <Text className="text-base text-[#444] mb-2">
          We will send a verification to:
        </Text>
        <Text className="text-lg font-semibold text-black mb-4">{email}</Text>
        <Text className="text-sm text-[#888]">
          Make sure this email is active and accessible.
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleSendVerification}
        disabled={loading || countdown > 0}
        style={{
          backgroundColor: countdown > 0 ? "#b6b6b6" : COLORS.primary,
          paddingVertical: 16,
          borderRadius: 14,
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color="#FCBC03" />
        ) : (
          <Text className="text-white font-semibold text-base">
            {countdown > 0 ? `Resend in ${countdown}s` : "Send Verification"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
