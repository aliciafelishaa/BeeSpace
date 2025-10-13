import React, { useState } from "react"
import { View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import { InputField } from "@/components/auth/InputField"
import SearchableDropdown from "@/components/auth/Dropdown"
import Text from "@/components/ui/Text"
import IconBoarding from "@/components/ui/IconBoarding"
import { useForm, Controller } from "react-hook-form"
import { useAuth } from "@/hooks/useAuth"
import { updateUserProfile, StudentProfile } from "@/services/userService"
import { storage } from "@/config/firebaseConfig"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"

export default function StudentBoarding() {
    const { user } = useAuth()
    const [step, setStep] = useState<number>(1)
    const [loading, setLoading] = useState(false)
    const [studentCard, setStudentCard] = useState<string | null>(null)

    const { control, handleSubmit, watch } = useForm<StudentProfile>({
        defaultValues: {
            fullName: "",
            username: "",
            university: "",
            major: "",
            enrollYear: "",
            gradYear: "",
            studentID: "",
            studentCard: null,
        },
    })

    if (!user) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Loading user...</Text>
            </View>
        )
    }

    const universities = ["Harvard", "Stanford", "MIT", "UC Berkeley"]
    const majors = ["Computer Science", "Business", "Biology", "Engineering"]
    const years = ["2018", "2019", "2020", "2021", "2022", "2023"]

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 3))
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

    const renderProgress = () => (
        <View className="flex-row justify-center mb-4">
            {[1, 2, 3].map((i) => (
                <View
                    key={i}
                    className={`h-2 flex-1 mx-1 rounded-full ${i <= step ? "bg-[#FFD661]" : "bg-[#ECA609]"}`}
                />
            ))}
        </View>
    )

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        })
        if (!result.canceled) {
            setStudentCard(result.assets[0].uri)
        }
    }

    const onSubmit = async (data: StudentProfile) => {
        setLoading(true)
        try {
            let studentCardUrl = studentCard

            if (studentCard) {
                const response = await fetch(studentCard)
                const blob = await response.blob()
                const storageRef = ref(storage, `studentCards/${user.uid}`)
                await uploadBytes(storageRef, blob)
                studentCardUrl = await getDownloadURL(storageRef)
            }

            await updateUserProfile(user.uid, { ...data, studentCard: studentCardUrl })
            alert("Profile submitted successfully!")
            // redirect jika perlu
        } catch (err) {
            console.error(err)
            alert("Failed to submit profile. Try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <ScrollView className="w-full bg-[#FAFAFA]">
            <View className="bg-[#FCBC03] py-3 px-3">
                {renderProgress()}
                <View className="flex flex-row items-center">
                    {step > 1 && (
                        <TouchableOpacity onPress={prevStep} className="mb-4 ml-2">
                            <Ionicons name="arrow-back" size={30} color="#404040" />
                        </TouchableOpacity>
                    )}
                    <View className="flex flex-row justify-center items-center mb-3 ml-6">
                        <IconBoarding />
                        <View className="ml-6">
                            <Text className="text-[#171717] text-xl font-bold mb-1">Complete Your Profile</Text>
                            <Text className="text-[#171717] font-medium text-base">Step {step} of 3</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View className="p-6 space-y-4">
                {/* Step 1 */}
                {step === 1 && (
                    <>
                        <InputField control={control} name="fullName" placeholder="Full Name" />
                        <InputField control={control} name="username" placeholder="Username" />
                        <Controller
                            control={control}
                            name="university"
                            render={({ field: { onChange, value } }) => (
                                <SearchableDropdown
                                    label="University"
                                    placeholder="Select University"
                                    value={value}
                                    onValueChange={onChange}
                                    options={universities}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="major"
                            render={({ field: { onChange, value } }) => (
                                <SearchableDropdown
                                    label="Major"
                                    placeholder="Select Major"
                                    value={value}
                                    onValueChange={onChange}
                                    options={majors}
                                />
                            )}
                        />
                        <View className="flex-row justify-end mt-4">
                            <TouchableOpacity
                                onPress={nextStep}
                                className="w-1/3 bg-yellow-400 h-12 rounded-lg flex justify-center items-center"
                            >
                                <Text className="text-white font-bold">Next</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {/* Step 2 */}
                {step === 2 && (
                    <>
                        <Controller
                            control={control}
                            name="enrollYear"
                            render={({ field: { onChange, value } }) => (
                                <SearchableDropdown
                                    label="Enrollment Year"
                                    placeholder="Select Enrollment Year"
                                    value={value}
                                    onValueChange={onChange}
                                    options={years}
                                />
                            )}
                        />
                        <Controller
                            control={control}
                            name="gradYear"
                            render={({ field: { onChange, value } }) => (
                                <SearchableDropdown
                                    label="Graduation Year"
                                    placeholder="Select Graduation Year"
                                    value={value}
                                    onValueChange={onChange}
                                    options={years}
                                />
                            )}
                        />
                        <View className="flex-row justify-end mt-4">
                            <TouchableOpacity
                                onPress={nextStep}
                                className="w-1/3 bg-yellow-400 h-12 rounded-lg flex justify-center items-center"
                            >
                                <Text className="text-white font-bold">Next</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}

                {/* Step 3 */}
                {step === 3 && (
                    <>
                        <InputField control={control} name="studentID" placeholder="Student ID" />
                        <Text className="text-[#404040] mb-1 font-semibold text-base">Student ID Card</Text>
                        <TouchableOpacity
                            onPress={pickImage}
                            className="border-2 border-dashed border-gray-400 py-8 rounded-lg justify-center items-center mt-3"
                        >
                            <Image source={require("@/assets/images/icon-boarding-step3.png")} className="mb-4" />
                            <Text className="text-center font-medium">
                                {studentCard ? "Change Student ID Card" : "Upload the picture of your Student ID Card"}
                            </Text>
                            <Text className="text-sm text-gray-500 mt-1">Format: JPG, PNG (Max 5MB)</Text>
                            <Text className="bg-[#FCBC03] px-3 py-2 rounded text-[#FAFAFA] mt-2">Select files</Text>
                        </TouchableOpacity>
                        {studentCard && (
                            <Image
                                source={{ uri: studentCard }}
                                className="w-full h-40 mt-2 rounded-lg"
                                resizeMode="contain"
                            />
                        )}
                        <View className="flex-row justify-end mt-4">
                            <TouchableOpacity
                                onPress={handleSubmit(onSubmit)}
                                disabled={loading}
                                className={`w-1/3 h-12 rounded-lg flex justify-center items-center ${loading ? "bg-yellow-200" : "bg-yellow-400"
                                    }`}
                            >
                                {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold">Submit</Text>}
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    )
}
