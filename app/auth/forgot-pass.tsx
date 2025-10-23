import React, { useState } from "react"
import { View, TouchableOpacity, ScrollView } from "react-native"
import { useForm } from "react-hook-form"
import { useRouter } from "expo-router"
import { InputField } from "@/components/auth/InputField"
import Text from "@/components/ui/Text"
import LogoBeeSpace from "@/components/ui/LogoBeeSpace"
import { sendResetPasswordEmail } from "@/services/authService"

type ForgotForm = { email: string }

export default function ForgotPass() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ForgotForm>()

    const onSubmit = async (data: ForgotForm) => {
        setError("")
        setSuccess("")
        setLoading(true)

        try {
            await sendResetPasswordEmail(data.email)
            setSuccess("Password reset link sent to your email!")
            reset()
        } catch (err: any) {
            if (err.message === "EMAIL_NOT_REGISTERED") {
                setError("This email is not registered.")
            } else if (err.message === "INVALID_EMAIL") {
                setError("Please enter a valid email.")
            } else {
                setError("Failed to send reset link. Please try again.")
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
                <Text className="text-3xl font-bold text-center my-4">Forgot Password</Text>
                <Text className="text-[#737373] text-center font-medium mb-6">
                    Enter your email and we’ll send you a password reset link.
                </Text>
            </View>

            <InputField
                control={control}
                name="email"
                placeholder="Email"
                icon="mail"
                rules={{
                    required: "Email is required",
                    pattern: {
                        value: /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{1,}$/,
                        message: "Invalid email format",
                    },
                }}
                error={errors.email?.message}
            />

            {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}
            {success ? <Text className="text-green-500 mb-2">{success}</Text> : null}

            <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
                className={`bg-[#FCBC03] justify-center h-14 rounded-lg mt-4 ${loading ? "opacity-60" : ""}`}
            >
                <Text className="text-white text-center text-lg font-bold">
                    {loading ? "Sending..." : "Send Recovery Link"}
                </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6 mb-12">
                <Text className="text-[#404040] font-medium">Remember your password? </Text>
                <TouchableOpacity onPress={() => router.push("/auth/login")}>
                    <Text className="text-[#DC9010] font-semibold">Back to Login</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}
