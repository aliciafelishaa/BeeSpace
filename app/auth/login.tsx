import React, { useEffect, useState } from "react"
import { View, TouchableOpacity, ScrollView } from "react-native"
import { useForm } from "react-hook-form"
import { useRouter } from "expo-router"
import { InputField } from "@/components/auth/InputField"
import Text from "@/components/ui/Text"
import IconGoogle from "@/components/ui/IconGoogle"
import LogoBeeSpace from "@/components/ui/LogoBeeSpace"
import { loginWithEmail, useGoogleAuth } from "@/services/authService"
import * as WebBrowser from "expo-web-browser"

WebBrowser.maybeCompleteAuthSession()

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

    const { request, response, promptAsync, handleGoogleResponse } = useGoogleAuth()

    useEffect(() => {
        const handleResponse = async () => {
            if (!response) return
            try {
                setLoading(true)
                await handleGoogleResponse()
                router.replace("/myroom/roomDashboard")
            } catch (err) {
                console.error("Google login error:", err)
                setError("Google login failed. Please try again.")
            } finally {
                setLoading(false)
            }
        }
        handleResponse()
    }, [response])

    const onSubmit = async (data: LoginForm) => {
        setError("")
        setSuccess("")
        setLoading(true)
        try {
            await loginWithEmail(data.email, data.password)
            setSuccess("Login successful!")
            reset()
            router.push("/")
        } catch (err: any) {
            console.error("Login error:", err)
            switch (err.message) {
                case "EMAIL_NOT_REGISTERED":
                    setError("Email is not registered.")
                    break
                case "PASSWORD_INCORRECT":
                    setError("Password is incorrect.")
                    break
                case "INVALID_EMAIL":
                    setError("Invalid email address.")
                    break
                default:
                    setError("Login failed. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <ScrollView contentContainerStyle={{
            flex: 1,
            justifyContent: "center",
            paddingHorizontal: 40,
            backgroundColor: "#FAFAFA",
        }}
        >
            <View className="w-full items-center mb-10 mt-12">
                <LogoBeeSpace />
                <Text className="text-3xl font-bold text-center my-4">Welcome back, Beeps!</Text>
                <Text className="text-lg text-[#737373] font-medium mb-10">Select your method to log in</Text>
            </View>

            <InputField
                control={control}
                name="email"
                placeholder="Email"
                icon="mail"
                rules={{
                    required: "Email is required",
                    pattern: { value: /^[\w.%+-]+@[\w.-]+\.[a-zA-Z]{1,}$/, message: "Invalid email format" },
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
                    minLength: { value: 6, message: "Minimum 6 characters" },
                }}
                error={errors.password?.message}
            />

            {error ? <Text className="text-red-500 mb-2">{error}</Text> : null}
            {success ? <Text className="text-green-500 mb-2">{success}</Text> : null}

            <TouchableOpacity className="mb-6" onPress={() => router.push("/auth/forgot-pass")}>
                <Text className="text-[#DC9010] font-semibold">Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
                className={`bg-[#FCBC03] justify-center h-14 rounded-lg mb-4 mt-2 ${loading ? "opacity-60" : ""}`}
            >
                <Text className="text-white text-center text-lg font-bold">{loading ? "Logging in..." : "Log In"}</Text>
            </TouchableOpacity>

            <View className="flex-row items-center my-4">
                <View className="flex-1 h-px bg-gray-300" />
                <Text className="mx-3 text-gray-400 font-semibold">or continue with</Text>
                <View className="flex-1 h-px bg-gray-300" />
            </View>

            <TouchableOpacity
                disabled={!request}
                onPress={() => promptAsync()}
                className="flex-row items-center justify-center border border-gray-300 h-14 rounded-lg mb-4 gap-2"
            >
                <IconGoogle />
                <Text className="text-[#171717] font-bold">Google</Text>
            </TouchableOpacity>

            <View className="flex-row justify-center mt-4 mb-12">
                <Text className="text-[#404040] font-medium">Don’t have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/auth/register")}>
                    <Text className="text-[#DC9010] font-semibold">Create an account</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}
