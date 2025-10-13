import DatePickerInput from "@/components/createroom/DatePickerInput";
import DropdownInput from "@/components/createroom/DropdownInput";
import FormInput from "@/components/createroom/FormInput";
import ImagePicker from "@/components/createroom/ImagePicker";
import RadioGroup from "@/components/createroom/RadioGroup";
import TimePickerInput from "@/components/createroom/TimePickerInput";
import ToggleSwitch from "@/components/createroom/ToggleSwitch";
import IconBack from "@/components/ui/icon-back";
import Text from "@/components/ui/Text";
import { COLORS } from "@/constants/utils/colors";
import { useAuthState } from "@/hooks/useAuthState";
import { useRoom } from "@/hooks/useRoom";
import { useRoomCover } from "@/hooks/useRoomCover";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function CreateRoomPage() {
  const [step, setStep] = useState(1);
  const handleBack = () => router.back();
  const insets = useSafeAreaInsets();
  const { user } = useAuthState();
  const { addRoom } = useRoom();
  const { image, uploading, pickPhoto } = useRoomCover(undefined, (url) => {
    handleChange("cover", url);
  });
  // const { data, setField } = useSignupContext();

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    cover: "",
    planName: "",
    description: "",
    category: "",
    place: "",
    date: new Date(),
    timeStart: "",
    timeEnd: "",
    minMember: "",
    maxMember: "",
    locationDetail: "",
    openPublic: false,
    enableChat: false,
  });

  const handleChange = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleNext = () => {
    let errors: Record<string, string> = {};

    if (!formData.planName) errors.planName = "Plan Name is required";
    if (!formData.description) errors.description = "Description is required";
    if (!formData.category) errors.category = "Category is required";
    if (!formData.place) errors.place = "Place is required";

    if (formData.place && !formData.locationDetail)
      errors.locationDetail =
        formData.place === "Online"
          ? "Please enter Zoom/Google Meet link"
          : "Please enter onsite location";

    if (!formData.date) errors.date = "Date is required";
    if (!formData.timeStart) errors.timeStart = "Time is required";

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handleFocus = (key: string) => {
    if (formErrors[key]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[key];
        return newErrors;
      });
    }
  };

  const handleSubmit = async () => {
    // if (!user?.uid) {
    //   setErrorMessage("You must be logged in to save a diary");
    //   setShowError(true);
    //   return;
    // }
    console.log("testing2");
    const inputRoom = {
      // fromUid: user?.uid,
      ...formData,
      date: new Date(formData.date),
    };

    const result = await addRoom(inputRoom);
    if (result.success) {
      console.log("✅ Form Submitted:", result);
      router.back();
    } else {
      setErrorMessage(result.message || "Failed to create room");
      setShowError(true);
    }
  };

  return (
    <SafeAreaView
      className="bg-[#FAFAFA]"
      style={{
        backgroundColor: COLORS.white,
        flex: 1,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: insets.bottom + 100,
        }}
        showsVerticalScrollIndicator={false}
        className="bg-[#FAFAFA]"
      >
        <View className="mt-12 mb-6 items-center justify-center">
          <TouchableOpacity
            onPress={handleBack}
            className="w-12 h-12 pb-2 rounded-full bg-[#FFFFFF] border border-[#F5F5F5] absolute left-5 top-0 justify-center items-center"
          >
            <IconBack />
          </TouchableOpacity>

          <Text className="text-center font-interMedium text-[20px]">
            Let’s Create a Plan!
          </Text>
        </View>

        <View className="flex-row items-center justify-between mb-8 mx-12">
          {[1, 2, 3].map((num, index) => (
            <React.Fragment key={num}>
              <View className="items-center">
                <View
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    step >= num ? "bg-[#FFD661]" : "bg-[#FFF6D5]"
                  }`}
                >
                  <Text
                    className={`font-medium text-lg ${
                      step >= num ? "text-black" : "text-[#737373]"
                    }`}
                  >
                    {num}
                  </Text>
                </View>
                <Text
                  className={`mt-2 ${step >= num ? "text-[#404040]" : "text-[#737373]"}`}
                >
                  {num === 1 ? "Detail" : num === 2 ? "Member" : "Setting"}
                </Text>
              </View>

              {index < 2 && (
                <View
                  className={`flex-1 h-[2px] ${
                    step > num ? "bg-[#FFD661]" : "bg-[#FFF6D5]"
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Form Container */}
        <View className="bg-white mx-5 rounded-2xl p-5">
          {step === 1 && (
            <View>
              <ImagePicker
                label="Cover"
                imageUrl={image || formData.cover || undefined}
                onChangeImage={() => pickPhoto("gallery")}
                size={120}
                onEdit={false}
              />

              <FormInput
                label="Plan Name"
                value={formData.planName}
                onChangeText={(v) => handleChange("planName", v)}
                placeholder="What’s your plan?"
                required
                error={formErrors.planName}
                onFocus={() => handleFocus("planName")}
                onEdit={false}
              />

              <FormInput
                label="Description"
                value={formData.description}
                onChangeText={(v) => handleChange("description", v)}
                placeholder="What’s your agenda?"
                multiline
                required
                inputStyle={{
                  height: 120,
                  textAlignVertical: "top",
                  paddingTop: 12,
                }}
                error={formErrors.description}
                onFocus={() => handleFocus("description")}
                onEdit={false}
              />

              <DropdownInput
                label="Category"
                selectedValue={formData.category}
                onValueChange={(v) => {
                  handleChange("category", v);
                  handleFocus("category");
                }}
                placeholder="Select Category"
                options={[
                  { label: "Sport & Fitness", value: "Sport & Fitness" },
                  {
                    label: "Transportation Sharing",
                    value: "Transportation Sharing",
                  },
                  { label: "Academic & Study", value: "Academic & Study" },
                  {
                    label: "Events & Activities",
                    value: "Events & Activities",
                  },
                  { label: "Food & Hangout", value: "Food & Hangout" },
                  { label: "Community & Hobby", value: "Community & Hobby" },
                  { label: "Health & Wellness", value: "Health & Wellness" },
                  {
                    label: "Competition & Challenge",
                    value: "Competition & Challenge",
                  },
                  { label: "Other", value: "Other" },
                ]}
                required
                error={formErrors.category}
                onEdit={false}
              />

              <View>
                <RadioGroup
                  label="Place"
                  options={[
                    { label: "Online", value: "Online" },
                    { label: "Onsite", value: "Onsite" },
                  ]}
                  selectedValue={formData.place}
                  onValueChange={(v) => handleChange("place", v)}
                  required
                  error={formErrors.place}
                  onEdit={false}
                />
                {formData.place !== "" && (
                  <FormInput
                    value={formData.locationDetail}
                    onChangeText={(v) => {
                      handleChange("locationDetail", v);
                      setFormErrors((prev) => ({
                        ...prev,
                        locationDetail: "",
                      }));
                    }}
                    placeholder={
                      formData.place === "Online"
                        ? "Enter Zoom/Google Meet link..."
                        : "Enter onsite location..."
                    }
                    required
                    // error={formErrors.locationDetail}
                    onEdit={false}
                  />
                )}
              </View>

              <DatePickerInput
                label="Date"
                value={formData.date}
                onChange={(v) => handleChange("date", v)}
                required
                error={formErrors.date}
              />

              <TimePickerInput
                label="Time"
                startValue={formData.timeStart}
                endValue={formData.timeEnd}
                onChangeStart={(v) => handleChange("timeStart", v)}
                onChangeEnd={(v) => handleChange("timeEnd", v)}
                required
              />
            </View>
          )}

          {step === 2 && (
            <View>
              <FormInput
                label="Minimum Member"
                placeholder="-"
                value={formData.minMember}
                onChangeText={(v) => {
                  if (!/^\d*$/.test(v)) return;

                  let num = v === "" ? "" : Math.min(parseInt(v), 500);
                  handleChange("minMember", num.toString());
                }}
                onBlur={() => {
                  if (!formData.minMember || formData.minMember === "") {
                    handleChange("minMember", "0");
                  }
                }}
                isNumeric
                onEdit={false}
              />

              <FormInput
                label="Maximum Member"
                placeholder="-"
                value={formData.maxMember}
                onChangeText={(v) => {
                  if (!/^\d*$/.test(v)) return;

                  let num = v === "" ? "" : Math.min(parseInt(v), 500);
                  handleChange("maxMember", num.toString());
                }}
                onBlur={() => {
                  if (!formData.maxMember || formData.maxMember === "") {
                    handleChange("maxMember", "0");
                  }
                }}
                error={
                  formData.minMember &&
                  formData.maxMember &&
                  parseInt(formData.maxMember) < parseInt(formData.minMember)
                    ? "Max member cannot be less than Min member"
                    : undefined
                }
                isNumeric
                onEdit={false}
              />
            </View>
          )}

          {step === 3 && (
            <View>
              <ToggleSwitch
                label="Open for Public"
                description="The plan is publicly accessible"
                value={formData.openPublic}
                onValueChange={(v) => handleChange("openPublic", v)}
              />

              <ToggleSwitch
                label="Enable Chat"
                description="The room is publicly accessible"
                value={formData.enableChat}
                onValueChange={(v) => handleChange("enableChat", v)}
              />
            </View>
          )}

          <View className="w-full flex-row mt-6 gap-4">
            {step > 1 ? (
              <>
                <TouchableOpacity
                  onPress={handleBack}
                  className="flex-1 border border-[#FCBC03] py-3 rounded-xl items-center justify-center"
                >
                  <Text className="text-[#FCBC03] font-medium text-lg">
                    Back
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={step === 3 ? handleSubmit : handleNext}
                  className="flex-1 bg-[#FCBC03] py-3 rounded-xl items-center justify-center"
                >
                  <Text className="text-white font-bold text-xl">
                    {step === 3 ? "Submit" : "Next"}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                onPress={handleNext}
                className="flex-1 bg-[#FCBC03] py-3 rounded-xl items-center justify-center"
              >
                <Text
                  className="text-white font-bold text-lg"
                  style={{ fontWeight: "bold" }}
                >
                  Next
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
