import React, { useState, useEffect } from "react"
import { View, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { InputField } from "@/components/auth/InputField"
import { SearchableDropdown } from "@/components/auth/Dropdown"
import Text from "@/components/ui/Text"
import { useForm, Controller } from "react-hook-form"
import { useAuth } from "@/hooks/useAuth"
import { updateUserProfile, StudentProfile, checkUsernameExists } from "@/services/userService"
import handleUpData from "@/hooks/useCloudinary"
import { universityMajors, years } from "@/components/utils/useA"
import ImagePicker from "@/components/auth/ImagePicker"
import { useRouter } from "expo-router"

export default function StudentBoarding() {
    const { user } = useAuth()
    const router = useRouter()
    const [step, setStep] = useState<number>(1)
    const [loading, setLoading] = useState(false)
    const [studentCard, setStudentCard] = useState<string | null>(null)
    const [profilePicture, setProfilePicture] = useState<string | null>(null)
    const [majorsOptions, setMajorsOptions] = useState<string[]>([])

    const { control, handleSubmit, watch, setValue, trigger, setError, formState: { errors }, clearErrors } = useForm<StudentProfile>({
        defaultValues: {
            fullName: "",
            username: "",
            university: "",
            major: "",
            enrollYear: "",
            gradYear: "",
            studentID: "",
            studentCard: null,
            profilePicture: null,
        },
    })

    const selectedUniversity = watch("university")
    const enrollYear = watch("enrollYear")
    const gradYear = watch("gradYear")

    useEffect(() => {
        if (selectedUniversity && universityMajors[selectedUniversity]) {
            setMajorsOptions(universityMajors[selectedUniversity])
            setValue("major", "")
        } else {
            setMajorsOptions([])
            setValue("major", "")
        }
    }, [selectedUniversity])

    if (!user) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Loading user...</Text>
            </View>
        )
    }

    const nextStep = async () => {
        let fieldsToValidate: (keyof StudentProfile)[] = []
        if (step === 1) fieldsToValidate = ["fullName", "username", "university", "major"]
        if (step === 2) fieldsToValidate = ["enrollYear", "gradYear"]
        if (step === 3) fieldsToValidate = ["studentID"]

        const isValid = await trigger(fieldsToValidate)
        if (isValid) setStep(prev => Math.min(prev + 1, 3))
    }

    const prevStep = () => setStep(prev => Math.max(prev - 1, 1))

    const renderProgress = () => (
        <View className="flex-row justify-center mb-4">
            {[1, 2, 3].map(i => (
                <View
                    key={i}
                    className={`h-2 flex-1 mx-1 rounded-full ${i <= step ? "bg-[#FFD661]" : "bg-[#ECA609]"}`}
                />
            ))}
        </View>
    )

    const onSubmit = async (data: StudentProfile) => {
        setLoading(true)
        try {
            let studentCardUrl: string | null = null
            let profilePictureUrl: string | null = null

            if (studentCard) {
                const fileObj = { uri: studentCard, name: "student-card.jpg", type: "image/jpeg" }
                studentCardUrl = await handleUpData(fileObj)
            }

            if (profilePicture) {
                const fileObj = { uri: profilePicture, name: "profile-picture.jpg", type: "image/jpeg" }
                profilePictureUrl = await handleUpData(fileObj)
            }

            await updateUserProfile(user.uid, {
                ...data,
                studentCard: studentCardUrl,
                profilePicture: profilePictureUrl,
            })
            
            console.log("Profile submitted successfully!")
            router.push({ pathname: "/auth/login" })
        } catch (err: any) {
            console.error("Upload/Submit Error:", err)
        } finally {
            setLoading(false)
        }
    }

    const validateUsername = async (username: string) => {
        const exists = await checkUsernameExists(username)
        if (exists) {
            setError("username", { type: "manual", message: "Username already taken" })
            return false
        }
        return true
    }

    const validateGradYear = (gradYear: string) => {
        if (enrollYear && gradYear) {
            const enroll = parseInt(enrollYear)
            const grad = parseInt(gradYear)
            if (grad <= enroll) {
                setError("gradYear", { type: "manual", message: "Graduation year must be at least one year after enrollment" })
                return false
            }
        }
        return true
    }

    return (
        <ScrollView className="w-full bg-[#FAFAFA] " keyboardShouldPersistTaps="handled">
            <View className="bg-[#FCBC03]  px-3 pt-16">
                {renderProgress()}
                <View className="flex flex-row items-center">
                    {step > 1 && (
                        <TouchableOpacity onPress={prevStep} className="mb-4 ml-2">
                            <Ionicons name="arrow-back" size={30} color="#404040" />
                        </TouchableOpacity>
                    )}
                    <View className="flex flex-row justify-center items-center mb-3 ml-6">
                        <Image
                            source={require("@/assets/images/logo-beespace.png")}
                            style={{ width: 50, height: 50 }} />
                        <View className="ml-6">
                            <Text className="text-[#171717] text-xl font-bold mb-1">Complete Your Profile</Text>
                            <Text className="text-[#171717] font-medium text-base">Step {step} of 3</Text>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView className="p-8 space-y-4">
                {step === 1 && (
                    <>
                        <Text weight="SemiBold" className="text-[#404040] text-lg mb-1">Profile Picture</Text>
                        <ImagePicker
                            value={profilePicture}
                            onChange={setProfilePicture}
                            shape="circle"
                            showText={false}
                        />

                        <InputField
                            label="Full Name"
                            control={control}
                            name="fullName"
                            placeholder="Input Text Here"
                            rules={{ required: "Full Name is required" }}
                            error={errors.fullName?.message as string}
                            onClearError={() => clearErrors("fullName")}
                            alphabeticOnly={true}
                            maxLength={50}
                        />

                        <InputField
                            label="Username"
                            control={control}
                            name="username"
                            placeholder="Input Text Here"
                            rules={{
                                required: "Username is required",
                                validate: async (value: string) => {
                                    const exists = await checkUsernameExists(value)
                                    return exists ? "Username already taken" : true
                                },
                            }}
                            error={errors.username?.message as string}
                            onClearError={() => clearErrors("username")}
                            maxLength={30}
                            usernameOnly={true}
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
                        <Controller
                            control={control}
                            name="university"
                            rules={{ required: "University is required" }}
                            render={({ field: { onChange, value } }) => (
                                <SearchableDropdown
                                    label="University"
                                    placeholder="Select University"
                                    value={value}
                                    onValueChange={(val) => { onChange(val); clearErrors("university") }}
                                    options={Object.keys(universityMajors)}
                                    error={errors.university?.message as string}
                                    onClearError={() => clearErrors("university")}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="major"
                            rules={{ required: "Major is required" }}
                            render={({ field: { onChange, value } }) => (
                                <SearchableDropdown
                                    label="Major"
                                    placeholder="Select Major"
                                    value={value}
                                    onValueChange={(val) => { onChange(val); clearErrors("major") }}
                                    options={majorsOptions}
                                    error={errors.major?.message as string}
                                    onClearError={() => clearErrors("major")}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="enrollYear"
                            rules={{ required: "Enrollment Year is required" }}
                            render={({ field: { onChange, value } }) => (
                                <SearchableDropdown
                                    label="Enrollment Year"
                                    placeholder="Select Enrollment Year"
                                    value={value}
                                    onValueChange={(val) => {
                                        onChange(val)
                                        clearErrors("enrollYear")
                                        validateGradYear(gradYear || "")
                                    }}
                                    options={years}
                                    error={errors.enrollYear?.message as string}
                                    onClearError={() => clearErrors("enrollYear")}
                                />
                            )}
                        />

                        <Controller
                            control={control}
                            name="gradYear"
                            rules={{
                                required: "Graduation Year is required",
                                validate: (value) => {
                                    if (!enrollYear) return true
                                    const enroll = parseInt(enrollYear)
                                    const grad = parseInt(value)
                                    return grad <= enroll
                                        ? "Graduation year must be at least one year after enrollment"
                                        : true
                                }
                            }}
                            render={({ field: { onChange, value } }) => (
                                <SearchableDropdown
                                    label="Graduation Year"
                                    placeholder="Select Graduation Year"
                                    value={value}
                                    onValueChange={(val) => {
                                        onChange(val)
                                        clearErrors("gradYear")
                                    }}
                                    options={years}
                                    error={errors.gradYear?.message as string}
                                    onClearError={() => clearErrors("gradYear")}
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

                {step === 3 && (
                    <>
                        <InputField
                            label="Student ID"
                            control={control}
                            name="studentID"
                            placeholder="Student ID"
                            maxLength={20}
                            numericOnly={true}
                            rules={{ required: "Student ID is required" }}
                            error={errors.studentID?.message as string}
                            onClearError={() => clearErrors("studentID")}
                        />

                        <Text weight="SemiBold" className="text-[#404040] text-lg mb-1">Student ID Card</Text>
                        <ImagePicker value={studentCard} onChange={setStudentCard} />

                        <View className="flex-row justify-end mt-4">
                            <TouchableOpacity
                                onPress={handleSubmit(onSubmit)}
                                disabled={loading}
                                className={`w-1/3 h-12 rounded-lg flex justify-center items-center ${loading ? "bg-yellow-200" : "bg-yellow-400"}`}
                            >
                                {loading ? <ActivityIndicator color="#fff" /> : <Text className="text-white font-bold">Submit</Text>}
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </ScrollView>
        </ScrollView>
    )
}
