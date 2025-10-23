import React, { useState } from "react"
import { View, TouchableOpacity, ScrollView } from "react-native"
import { useForm } from "react-hook-form"
import { useRouter } from "expo-router"
import { InputField } from "@/components/auth/InputField"
import Text from "@/components/ui/Text"
import LogoBeeSpace from "@/components/ui/LogoBeeSpace"
import { confirmPasswordReset } from "firebase/auth"
import { auth } from "@/config/firebaseConfig"
import { useLocalSearchParams } from "expo-router"

type ResetForm = {
    password: string
    confirmPassword: string
}

export default function ResetPass() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const { oobCode } = useLocalSearchParams()

    const {
        control,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<ResetForm>()

    const password = watch("password")

    const onSubmit = async (data: ResetForm) => {
        setError("")
        setSuccess("")
        setLoading(true)

        try {
            if (!oobCode) throw new Error("INVALID_CODE")

            await confirmPasswordReset(auth, oobCode as string, data.password)

            setSuccess("✅ Password has been reset successfully!")
            reset()

            setTimeout(() => router.push("/auth/login"), 2000)
        } catch (err: any) {
            console.error(err)
            if (err.message === "INVALID_CODE") {
                setError("Invalid or expired reset link.")
            } else {
                setError("Failed to reset password. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <ScrollView
            contentContainerStyle={{
                flexGrow: 1,
                justifyContent: "center",
                paddingHorizontal: 40,
                backgroundColor: "#FAFAFA",
            }}
        >
            <View className="w-full items-center mb-8">
                <LogoBeeSpace />
                <Text className="text-3xl font-bold text-center my-4">
                    Reset Password
                </Text>
                <Text className="text-[#737373] text-center font-medium mb-6">
                    Please enter your new password.
                </Text>
            </View>

            <InputField
                control={control}
                name="password"
                placeholder="New Password"
                icon="lock"
                type="password"
                rules={{
                    required: "Password is required",
                    minLength: {
                        value: 6,
                        message: "Minimum 6 characters",
                    },
                }}
                error={errors.password?.message}
            />

            <InputField
                control={control}
                name="confirmPassword"
                placeholder="Confirm New Password"
                icon="lock"
                type="password"
                rules={{
                    required: "Confirm password is required",
                    validate: (value: string) =>
                        value === password || "Passwords do not match",
                }}
                error={errors.confirmPassword?.message}
            />

            {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}
            {success ? <Text className="text-green-500 mb-2">{success}</Text> : null}

            <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
                className={`bg-[#FCBC03] justify-center h-14 rounded-lg mt-4 ${loading ? "opacity-60" : ""
                    }`}
            >
                <Text className="text-white text-center text-lg font-bold">
                    {loading ? "Saving..." : "Save your new password"}
                </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6 mb-12">
                <Text className="text-[#404040] font-medium">Back to </Text>
                <TouchableOpacity onPress={() => router.push("/auth/login")}>
                    <Text className="text-[#DC9010] font-semibold">Login</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}
