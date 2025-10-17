import React, { useState } from "react"
import { View, TouchableOpacity, ScrollView } from "react-native"
import { Feather } from "@expo/vector-icons"
import TextInput from "@/components/auth/TextInput"
import Text from "@/components/ui/Text"
import IconGoogle from "@/components/ui/IconGoogle"
import { useRouter } from "expo-router"

type RegisterForm = {
    fullName: string
    email: string
    password: string
    confirmPassword: string
}

export default function Register() {
    const [form, setForm] = useState<RegisterForm>({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    })
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleChange = (name: keyof RegisterForm, value: string) => {
        setForm({ ...form, [name]: value })
    }

    const handleSubmit = () => {
        setError("")
        setSuccess("")

        if (!form.fullName || !form.email || !form.password || !form.confirmPassword) {
            return setError("All fields are required")
        }
        if (!form.email.includes("@")) {
            return setError("Invalid email address")
        }
        if (form.password !== form.confirmPassword) {
            return setError("Passwords do not match")
        }
        if (form.password.length < 6) {
            return setError("Password must be at least 6 characters")
        }

        setTimeout(() => {
            setSuccess("Account created successfully!")
            setForm({ fullName: "", email: "", password: "", confirmPassword: "" })
        }, 1000)
    }

    return (
        <ScrollView className="flex-1 justify-center bg-[#FAFAFA] px-12">
            <View className="w-full flex justify-center items-center mb-6">
                <Text className="text-3xl font-bold text-center my-4">Create Account</Text>
                <Text className="text-[#737373] font-semibold mb-4">
                    Select your method to sign up
                </Text>
            </View>

            {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}
            {success ? <Text className="text-green-500 mb-2">{success}</Text> : null}

            <TextInput
                icon={<Feather name="user" size={20} color="gray" />}
                placeholder="Full Name"
                value={form.fullName}
                onChangeText={(v: string) => handleChange("fullName", v)}
            />

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

            <TextInput
                icon={<Feather name="lock" size={20} color="gray" />}
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChangeText={(v: string) => handleChange("confirmPassword", v)}
                secureTextEntry
                showPasswordToggle
                showPassword={showPassword}
                setShowPassword={setShowPassword}
            />

            <TouchableOpacity
                onPress={handleSubmit}
                className="bg-[#FCBC03] justify-center h-14 rounded-lg mt-2"
            >
                <Text className="text-white text-center text-lg font-bold">Sign Up</Text>
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
                <Text className="text-[#404040] font-medium">Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/login")}>
                    <Text className="text-[#DC9010] font-semibold">Sign in</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}
