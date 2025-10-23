import DatePickerInput from "@/components/createroom/DatePickerInput";
import DropdownInput from "@/components/createroom/DropdownInput";
import FormInput from "@/components/createroom/FormInput";
import ImagePicker from "@/components/createroom/ImagePicker";
import RadioGroup from "@/components/createroom/RadioGroup";
import TimeRangePickerInput from "@/components/createroom/TimePickerInput";
import ToggleSwitch from "@/components/createroom/ToggleSwitch";
import IconBack from "@/components/ui/icon-back";
import { COLORS } from "@/constants/utils/colors";
import { useAuthState } from "@/hooks/useAuthState";
import { useRoom } from "@/hooks/useRoom";
import { useRoomCover } from "@/hooks/useRoomCover";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function EditRoom() {
  const { user } = useAuthState();
  const { uid: paramUid, id } = useLocalSearchParams();
  const uid = paramUid || user?.uid;
  const [step, setStep] = useState(1);
  const insets = useSafeAreaInsets();
  const { addRoom, updateRoom, getRoomId } = useRoom();
  const handleBack = () => router.back();
  const { image, uploading, pickPhoto } = useRoomCover(undefined, (url) => {
    handleChange("cover", url);
  });
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
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [rooms, setRooms] = useState<any>(null);

  const handleChange = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
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
  const handleEdit = async () => {
    if (!user?.uid) {
      setErrorMessage("You must be logged in to save a diary");
      setShowError(true);
      return;
    }
    const inputRoom = {
      fromUid: user?.uid,
      ...formData,
      date: new Date(formData.date),
    };

    const result = await updateRoom(id, inputRoom, uid);
    if (result.success) {
      console.log("✅ Form Submitted:", result);
      router.back();
    } else {
      setErrorMessage(result.message || "Failed to create room");
      setShowError(true);
    }
  };
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

  useEffect(() => {
    const fetchRoom = async () => {
      if (!id || !uid) return;
      setLoading(true);
      const res = await getRoomId(id, uid);
      if (res.success && res.data) {
        console.log(res.data);
        setRooms(res.data);
      } else {
        setErrorMessage(res.message || "Failed to load room data");
      }

      setLoading(false);
    };
    fetchRoom();
  }, [id, uid]);

  useEffect(() => {
    if (rooms) {
      setFormData({
        cover: rooms.cover || "",
        planName: rooms.planName || "",
        description: rooms.description || "",
        category: rooms.category || "",
        place: rooms.place || "",
        date: rooms.date ? new Date(rooms.date) : new Date(),
        timeStart: rooms.timeStart || "",
        timeEnd: rooms.timeEnd || "",
        minMember: rooms.minMember ? String(rooms.minMember) : "",
        maxMember: rooms.maxMember ? String(rooms.maxMember) : "",
        locationDetail: rooms.locationDetail || "",
        openPublic: rooms.openPublic || false,
        enableChat: rooms.enableChat || false,
      });
    }
  }, [rooms]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView
      className="bg-neutral-100"
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
          <Text className="text-center font-interSemiBold text-[20px]">
            Edit Plan
          </Text>
        </View>

        {/* Form Container */}
        <View className="bg-white mx-5 rounded-2xl p-5">
          {step === 1 && (
            <View>
              {/* <ImagePicker
                  label="Cover"
                  value={formData.cover}
                  onChange={(v) => handleChange("cover", v)}
                  imageUrl={image || formData.cover || undefined}
                  onChangeImage={() => pickPhoto("gallery")}
                  size={120}
                  onEdit={false}
                /> */}
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
                onEdit={true}
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
                onEdit={true}
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
                onEdit={true}
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
                  onEdit={true}
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
                    onEdit={true}
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

              <TimeRangePickerInput
                label="Time"
                startValue={formData.timeStart}
                endValue={formData.timeEnd}
                onChangeStart={(v) => handleChange("timeStart", v)}
                onChangeEnd={(v) => handleChange("timeEnd", v)}
                required
              />
              <FormInput
                label="Minimum Member (optional)"
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
                label="Maximum Member (optional)"
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

              <View className="justify-between items-center flex-row mt-4">
                <Text className="text-neutral-900 text-[16px] font-interMedium">
                  Advanced Settings{" "}
                </Text>
                <TouchableOpacity onPress={() => setStep(2)}>
                  <Image
                    source={require("@/assets/utils/arrow-right.png")}
                    className="w-[12px] h-[24px]"
                    resizeMode="cover"
                  ></Image>
                </TouchableOpacity>
              </View>
            </View>
          )}
          {step === 2 && (
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
            {step === 1 && (
              <TouchableOpacity
                onPress={step === 1 ? handleEdit : handleNext}
                className="flex-1 bg-[#FCBC03] py-3 rounded-xl items-center justify-center"
              >
                <Text className="text-white font-bold text-xl">
                  {step === 1 ? "Submit" : "Next"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
