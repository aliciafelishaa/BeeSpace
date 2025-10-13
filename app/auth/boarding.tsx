import React, { useState, useEffect } from "react";
import { View, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { InputField } from "@/components/auth/InputField";
import SearchableDropdown from "@/components/auth/Dropdown";
import Text from "@/components/ui/Text";
import IconBoarding from "@/components/ui/IconBoarding";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { updateUserProfile, StudentProfile } from "@/services/userService";
import handleUpData from "@/hooks/useCloudinary";
import { universityMajors } from "@/hooks/useuniversityMajors";

export default function StudentBoarding() {
    const { user } = useAuth();
    const [step, setStep] = useState<number>(1);
    const [loading, setLoading] = useState(false);
    const [studentCard, setStudentCard] = useState<string | null>(null);
    const [majorsOptions, setMajorsOptions] = useState<string[]>([]);

    const { control, handleSubmit, watch, setValue } = useForm<StudentProfile>({
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
    });

    // Watch universitas agar bisa update jurusan
    const selectedUniversity = watch("university");

    useEffect(() => {
        if (selectedUniversity && universityMajors[selectedUniversity as string]) {
            setMajorsOptions(universityMajors[selectedUniversity as string]);
            setValue("major", "");
        } else {
            setMajorsOptions([]);
            setValue("major", "");
        }
    }, [selectedUniversity]);


    if (!user) {
        return (
            <View className="flex-1 justify-center items-center">
                <Text>Loading user...</Text>
            </View>
        );
    }

    const years = ["2018", "2019", "2020", "2021", "2022", "2023"];

    const nextStep = () => setStep((prev) => Math.min(prev + 1, 3));
    const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

    const renderProgress = () => (
        <View className="flex-row justify-center mb-4">
            {[1, 2, 3].map((i) => (
                <View
                    key={i}
                    className={`h-2 flex-1 mx-1 rounded-full ${i <= step ? "bg-[#FFD661]" : "bg-[#ECA609]"}`}
                />
            ))}
        </View>
    );

    const onSubmit = async (data: StudentProfile) => {
        setLoading(true);
        try {
            let studentCardUrl: string | null = null;

            if (studentCard) {
                const fileObj = { uri: studentCard, name: "student-card.jpg", type: "image/jpeg" };
                studentCardUrl = await handleUpData(fileObj);
            }

            await updateUserProfile(user.uid, { ...data, studentCard: studentCardUrl });
            alert("Profile submitted successfully!");
        } catch (err: any) {
            console.error("Upload/Submit Error:", err);
            alert("Failed to submit profile. Check console for details.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <ScrollView className="w-full bg-[#FAFAFA]" keyboardShouldPersistTaps="handled">
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
                        <InputField label="Full Name" control={control} name="fullName" placeholder="Input Text Here" />
                        <InputField label="Username" control={control} name="username" placeholder="Input Text Here" />
                        <Controller
                            control={control}
                            name="university"
                            render={({ field: { onChange, value } }) => (
                                <SearchableDropdown
                                    label="University"
                                    placeholder="Select University"
                                    value={value}
                                    onValueChange={onChange}
                                    options={Object.keys(universityMajors)}
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
                                    options={majorsOptions}
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

                {/* step 2 & 3 tetap sama */}
            </View>
        </ScrollView>
    );
}
