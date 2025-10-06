import React, { useState } from "react"
import { View, TouchableOpacity, ScrollView, Image } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import * as ImagePicker from "expo-image-picker"
import IconBoarding from "@/components/ui/IconBoarding"
import Text from "@/components/ui/Text"
import TextInput from "@/components/auth/TextInput"
import SearchableDropdown from "@/components/auth/Dropdown"

interface StudentProfile {
    fullName: string
    username: string
    university: string
    major: string
    enrollYear: string
    gradYear: string
    studentID: string
    studentCard: string | null
}

export default function StudentBoarding(): React.ReactElement {
    const [step, setStep] = useState<number>(1)
    const [profile, setProfile] = useState<StudentProfile>({
        fullName: "",
        username: "",
        university: "",
        major: "",
        enrollYear: "",
        gradYear: "",
        studentID: "",
        studentCard: null,
    })

    const universities: string[] = ["Harvard", "Stanford", "MIT", "UC Berkeley"]
    const majors: string[] = ["Computer Science", "Business", "Biology", "Engineering"]
    const years: string[] = ["2018", "2019", "2020", "2021", "2022", "2023"]

    const pickImage = async (): Promise<void> => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        })
        if (!result.canceled) {
            setProfile((prev) => ({ ...prev, studentCard: result.assets[0].uri }))
        }
    }

    const nextStep = (): void => setStep((prev) => Math.min(prev + 1, 3))
    const prevStep = (): void => setStep((prev) => Math.max(prev - 1, 1))

    const renderProgress = (): React.ReactElement => (
        <View className="flex-row justify-center mb-4">
            {[1, 2, 3].map((i) => (
                <View
                    key={i}
                    className={`h-2 flex-1 mx-1 rounded-full ${i <= step ? "bg-[#FFD661]" : "bg-[#ECA609]"}`}
                />
            ))}
        </View>
    )

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
                {step === 1 && (
                    <>
                        <TextInput
                            label="Full Name"
                            placeholder="Full Name"
                            value={profile.fullName}
                            onChangeText={(v) => setProfile((prev) => ({ ...prev, fullName: v }))}
                        />
                        <TextInput
                            label="Username"
                            placeholder="Username"
                            value={profile.username}
                            onChangeText={(v) => setProfile((prev) => ({ ...prev, username: v }))}
                        />
                        <SearchableDropdown
                            label="University’s Name"
                            placeholder="Select University"
                            value={profile.university}
                            onValueChange={(v) => setProfile((prev) => ({ ...prev, university: v }))}
                            options={universities}
                        />
                        <SearchableDropdown
                            label="Major"
                            placeholder="Select Major"
                            value={profile.major}
                            onValueChange={(v) => setProfile((prev) => ({ ...prev, major: v }))}
                            options={majors}
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

                {step === 2 && (
                    <>
                        <SearchableDropdown
                            label="Enrollment Year"
                            placeholder="Select Enrollment Year"
                            value={profile.enrollYear}
                            onValueChange={(v: string) => setProfile((prev) => ({ ...prev, enrollYear: v }))}
                            options={years}
                        />
                        <SearchableDropdown
                            label="Graduation Year"
                            placeholder="Select Graduation Year"
                            value={profile.gradYear}
                            onValueChange={(v: string) => setProfile((prev) => ({ ...prev, gradYear: v }))}
                            options={years}
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

                {step === 3 && (
                    <>
                        <TextInput
                            label="Student ID"
                            placeholder="Student ID"
                            value={profile.studentID}
                            onChangeText={(v) => setProfile((prev) => ({ ...prev, studentID: v }))}
                        />
                        <Text className="text-[#404040] mb-1 font-semibold text-base">Student ID Card</Text>
                        <TouchableOpacity
                            onPress={pickImage}
                            className="border-2 border-dashed border-gray-400 py-8 rounded-lg justify-center items-center mt-3"
                        >
                            <Image source={require("@/assets/images/icon-boarding-step3.svg")} className="mb-4" />
                            <Text className="text-center font-medium">
                                {profile.studentCard
                                    ? "Change Student ID Card"
                                    : "Upload the picture of your Student ID Card"}
                            </Text>
                            <Text className="text-sm text-gray-500 mt-1">Format: JPG, PNG (Max 5MB)</Text>
                            <Text className="bg-[#FCBC03] px-3 py-2 rounded text-[#FAFAFA] mt-2">Select files</Text>
                        </TouchableOpacity>
                        {profile.studentCard && (
                            <Image
                                source={{ uri: profile.studentCard }}
                                className="w-full h-40 mt-2 rounded-lg"
                                resizeMode="contain"
                            />
                        )}
                        <View className="flex-row justify-end mt-4">
                            <TouchableOpacity
                                className="w-1/3 bg-yellow-400 h-12 rounded-lg flex justify-center items-center"
                            >
                                <Text className="text-white font-bold">Submit</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        </ScrollView>
    )
}
