import React, { useState } from "react"
import { View, TouchableOpacity, ScrollView } from "react-native"
import { useForm } from "react-hook-form"
import { useRouter } from "expo-router"
import { InputField } from "@/components/auth/InputField"
import Text from "@/components/ui/Text"
import IconGoogle from "@/components/ui/IconGoogle"
import { registerWithEmail } from "@/services/authService"

type FormValues = {
    email: string
    password: string
    confirmPassword: string
}

export default function Register() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>()

    const onSubmit = async (data: FormValues) => {
        setError("")
        setSuccess("")
        setLoading(true)

        if (data.password !== data.confirmPassword) {
            setError("Passwords do not match")
            setLoading(false)
            return
        }

        try {
            const newUser = await registerWithEmail(data.email, data.password)
            setSuccess("Account created successfully!")
            reset()

            router.push({
                pathname: "/auth/boarding",
                params: { uid: newUser.uid },
            })
        } catch (err: any) {
            console.error(err)
            if (err.code === "auth/email-already-in-use") {
                setError("This email is already registered")
            } else if (err.code === "auth/invalid-email") {
                setError("Invalid email address")
            } else {
                setError("Registration failed, please try again")
            }
        } finally {
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
            <View className="w-full items-center mt-12">
                <Text className="text-2xl font-bold text-center">Create your account</Text>
                <Text className="text-lg text-[#737373] font-medium mb-14">
                    Select your method to sign up
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

            <InputField
                control={control}
                name="confirmPassword"
                placeholder="Confirm Password"
                icon="lock"
                type="password"
                rules={{
                    required: "Please confirm your password",
                    minLength: {
                        value: 6,
                        message: "Minimum 6 characters",
                    },
                }}
                error={errors.confirmPassword?.message}
            />

            <TouchableOpacity
                onPress={handleSubmit(onSubmit)}
                disabled={loading}
                className={`bg-[#FCBC03] justify-center h-14 rounded-lg mb-4 mt-2 ${loading ? "opacity-60" : ""
                    }`}
            >
                <Text className="text-white text-center text-lg font-bold">
                    {loading ? "Registering..." : "Sign Up"}
                </Text>
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

            <View className="flex-row justify-center mt-4 mb-12">
                <Text className="text-[#404040] font-medium">Already have an account? </Text>
                <TouchableOpacity onPress={() => router.push("/auth/login")}>
                    <Text className="text-[#DC9010] font-semibold">Sign In</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}
