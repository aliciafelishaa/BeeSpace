import React, { useState } from "react"
import { View, TouchableOpacity, ScrollView } from "react-native"
import { useForm } from "react-hook-form"
import { useRouter } from "expo-router"
import { InputField } from "@/components/auth/InputField"
import Text from "@/components/ui/Text"
import IconGoogle from "@/components/ui/IconGoogle"
import LogoBeeSpace from "@/components/ui/LogoBeeSpace"

type LoginForm = {
    email: string
    password: string
}

export default function Login() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<LoginForm>()

    const onSubmit = async (data: LoginForm) => {
        setError("")
        setSuccess("")

        if (!data.email || !data.password) {
            return setError("All fields are required")
        }

        try {
            setLoading(true)

            setTimeout(() => {
                setSuccess("Login successful!")
                setLoading(false)
                reset()
            }, 1000)
        } catch {
            setError("Login failed, please try again")
            setLoading(false)
        }
    }

    return (
        <ScrollView
            contentContainerStyle={{
                flex: 1,
                justifyContent: "center",
                paddingHorizontal: 40,
                backgroundColor: "#FAFAFA",
            }}
            showsVerticalScrollIndicator={false}
        >
            <View className="w-full items-center mb-10">
                <LogoBeeSpace />
                <Text className="text-3xl font-bold text-center my-4">
                    Welcome back, Beeps!
                </Text>
                <Text className="text-lg text-[#737373] font-medium mb-10">
                    Select your method to log in
                </Text>
            </View>

            {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}
            {success ? <Text className="text-green-500 mb-2">{success}</Text> : null}

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

            <InputField
                control={control}
                name="password"
                placeholder="Password"
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

            <TouchableOpacity className="mb-6">
                <Text className="text-[#DC9010] font-semibold">
                    Forgot Password?
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
                className={`bg-[#FCBC03] justify-center h-14 rounded-lg mb-4 mt-2 ${
                    loading ? "opacity-60" : ""
                }`}
            >
                <Text className="text-white text-center text-lg font-bold">
                    {loading ? "Logging in..." : "Log In"}
                </Text>
            </TouchableOpacity>

            <View className="flex-row items-center my-4">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="mx-3 text-gray-400 font-semibold">
                    or continue with
                </Text>
                <View className="flex-1 h-px bg-gray-300" />
            </View>

            <TouchableOpacity className="flex-row items-center justify-center border border-gray-300 h-14 rounded-lg mb-4 gap-2">
                <IconGoogle />
                <Text className="text-[#171717] font-bold">Google</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-4 mb-12">
                <Text className="text-[#404040] font-medium">
                    Don’t have an account?{" "}
                </Text>
                <TouchableOpacity onPress={() => router.push("/auth/register")}>
                    <Text className="text-[#DC9010] font-semibold">
                        Create an account
                    </Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}
