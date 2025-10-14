import TextInput from "@/components/auth/InputField"
import LogoBeeSpace from "@/components/ui/LogoBeeSpace"
import Text from "@/components/ui/Text"
import { Feather } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import React, { useState } from "react"
import { ScrollView, TouchableOpacity, View } from "react-native"

type ResetForm = {
    password: string
    confirmPassword: string
}

export default function ResetPass() {
    const router = useRouter()
    const [form, setForm] = useState<ResetForm>({
        password: "",
        confirmPassword: "",
    })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleChange = (name: keyof ResetForm, value: string) => {
        setForm({ ...form, [name]: value })
    }

    const handleSubmit = () => {
        setError("")
        setSuccess("")

        if (!form.password || !form.confirmPassword) {
            return setError("All fields are required")
        }
        if (form.password.length < 6) {
            return setError("Password must be at least 6 characters")
        }
        if (form.password !== form.confirmPassword) {
            return setError("Passwords do not match")
        }

        setTimeout(() => {
            setSuccess("Password has been reset successfully!")
            setForm({ password: "", confirmPassword: "" })
        }, 1000)
    }

    return (
        <ScrollView className="flex-1 justify-center bg-[#FAFAFA] px-12">
            <View className="w-full flex justify-center items-center mb-6">
                <LogoBeeSpace />
                <Text className="text-3xl font-bold text-center my-4">Reset Password</Text>
                <Text className="text-[#737373] font-semibold text-center mb-4">
                    You can now reset your password
                </Text>
            </View>

            {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}
            {success ? <Text className="text-green-500 mb-2">{success}</Text> : null}

            <TextInput
                icon={<Feather name="lock" size={20} color="gray" />}
                placeholder="New Password"
                value={form.password}
                onChangeText={(v: string) => handleChange("password", v)}
                secureTextEntry
                showPasswordToggle
                showPassword={showPassword}
                setShowPassword={setShowPassword}
            />

            <TextInput
                icon={<Feather name="lock" size={20} color="gray" />}
                placeholder="Confirm New Password"
                value={form.confirmPassword}
                onChangeText={(v: string) => handleChange("confirmPassword", v)}
                secureTextEntry
                showPasswordToggle
                showPassword={showPassword}
                setShowPassword={setShowPassword}
            />

            <TouchableOpacity
                onPress={handleSubmit}
                className="bg-[#FCBC03] justify-center h-14 rounded-lg mt-6"
            >
                <Text className="text-white text-center text-lg font-bold">
                    Save your new password
                </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-6">
                <Text className="text-[#404040] font-medium">Back to </Text>
                <TouchableOpacity onPress={() => router.push("/login")}>
                    <Text className="text-[#DC9010] font-semibold">Login</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}
