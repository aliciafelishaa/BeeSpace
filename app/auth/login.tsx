import React, { useState } from "react"
import { View, TouchableOpacity } from "react-native"
import { Feather } from "@expo/vector-icons"
import TextInput from "@/components/auth/TextInput"
import Text from "@/components/ui/Text"
import IconGoogle from "@/components/ui/IconGoogle"
import LogoBeeSpace from "@/components/ui/LogoBeeSpace"
import { useRouter } from "expo-router"

type LoginForm = {
    email: string
    password: string
}

export default function Login() {
    const router = useRouter()
    const [form, setForm] = useState<LoginForm>({ email: "", password: "" })
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleChange = (name: keyof LoginForm, value: string) => {
        setForm({ ...form, [name]: value })
    }

    const handleLogin = () => {
        setError("")
        setSuccess("")

        if (!form.email || !form.password) {
            return setError("All fields are required")
        }

        if (!form.email.includes("@")) {
            return setError("Invalid email address")
        }

        setTimeout(() => {
            setSuccess("Login successful!")
        }, 1000)
    }

    return (
        <View className="w-full h-full justify-center bg-[#FAFAFA] px-12">
            <View className="w-full flex justify-center items-center">
                <LogoBeeSpace />
                <Text className="text-3xl font-bold text-center my-4">Welcome back, Beeps!</Text>
                <Text className="text-[#737373] font-semibold mb-8">
                    Select your method to log in
                </Text>
            </View>

            {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}
            {success ? <Text className="text-green-500 mb-2">{success}</Text> : null}

            <TextInput
                icon={<Feather name="mail" size={20} color="gray" />}
                placeholder="Email"
                value={form.email}
                onChangeText={(v: string) => handleChange("email", v)}
                keyboardType="email-address"
            />

            <TextInput
                icon={<Feather name="lock" size={20} color="gray" />}
                placeholder="Password"
                value={form.password}
                onChangeText={(v: string) => handleChange("password", v)}
                secureTextEntry
                showPasswordToggle
                showPassword={showPassword}
                setShowPassword={setShowPassword}
            />

            <TouchableOpacity className="mb-6">
                <Text className="text-[#DC9010] font-semibold">Forgot Password</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleLogin}
                className="bg-[#FCBC03] justify-center h-14 rounded-lg mb-4"
            >
                <Text className="text-white text-center text-lg font-bold">Log In</Text>
            </TouchableOpacity>

            <View className="flex-row items-center my-4">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="mx-3 text-gray-400 font-semibold">or continue with</Text>
                <View className="flex-1 h-px bg-gray-300" />
            </View>

            <TouchableOpacity className="flex-row items-center justify-center border border-gray-300 h-14 rounded-lg mb-4 gap-2">
                <IconGoogle />
                <Text className="text-[#171717] font-bold">Google</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-4">
                <Text className="text-[#404040] font-medium">Don’t have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/register")}>
                    <Text className="text-[#DC9010] font-semibold">Create an account</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}
