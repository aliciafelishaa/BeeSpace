import TextInput from "@/components/auth/InputField"
import LogoBeeSpace from "@/components/ui/LogoBeeSpace"
import Text from "@/components/ui/Text"
import { Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { TouchableOpacity, View } from "react-native"

export default function ForgotPass() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleSubmit = () => {
        setError("")
        setSuccess("")

        if (!email) {
            return setError("Email is required")
        }

        if (!email.includes("@")) {
            return setError("Invalid email address")
        }

        setTimeout(() => {
            setSuccess("Password reset link sent to your email!")
        }, 1000)
    }

    return (
        <View className="w-full h-full justify-center bg-[#FAFAFA] px-12">
            <View className="w-full flex justify-center items-center mb-8">
                <LogoBeeSpace />
                <Text className="text-3xl font-bold text-center my-4">
                    Forgot Password
                </Text>
                <Text className="text-[#737373] font-semibold text-center">
                    You will receive password reset instructions via email. Please be sure to check your spam folder too.
                </Text>
            </View>


            <TextInput
                icon={<Feather name="mail" size={20} color="gray" />}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            
            {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}
            {success ? <Text className="text-green-500 mb-2">{success}</Text> : null}

            <TouchableOpacity
                onPress={handleSubmit}
                className="bg-[#FCBC03] justify-center h-14 rounded-lg mt-6"
            >
                <Text className="text-white text-center text-lg font-bold">
                    Send Recovery Link
                </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
                <Text className="text-[#404040] font-medium">
                    Remember your password?{" "}
                </Text>
                <TouchableOpacity onPress={() => router.push("/login")}>
                    <Text className="text-[#DC9010] font-semibold">Back to Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
