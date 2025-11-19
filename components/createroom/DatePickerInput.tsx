import DateTimePicker from "@react-native-community/datetimepicker";
import { Calendar } from "lucide-react-native";
import React, { useState } from "react";
import { Modal, Platform, Text, TouchableOpacity, View } from "react-native";

interface DatePickerInputProps {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  error?: string;
  required?: boolean;
  onFocus?: () => void;
}

export default function DatePickerInput({
  label,
  value,
  onChange,
  error,
  required = false,
  onFocus,
}: DatePickerInputProps) {
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(value || new Date());
  const [validationError, setValidationError] = useState("");

  const validateDate = (selectedDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const threeYearsFromNow = new Date(today);
    threeYearsFromNow.setFullYear(threeYearsFromNow.getFullYear() + 3);

    const selected = new Date(selectedDate);
    selected.setHours(0, 0, 0, 0);

    if (selected <= yesterday) {
      setValidationError("Date cannot be in the past");
      return false;
    }

    if (selected > threeYearsFromNow) {
      setValidationError("Date cannot be more than 3 years from now");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleChangePicker = (event: any, date?: Date) => {
    if (Platform.OS === "android") {
      setShow(false);
      if (event.type === "set" && date) {
        setTempDate(date);
        if (validateDate(date)) {
          onChange(date);
        }
      }
    } else if (date) {
      setTempDate(date);
    }
  };

  const handleConfirm = () => {
    if (validateDate(tempDate)) {
      onChange(tempDate);
      if (onFocus) onFocus();
      setShow(false);
    }
  };

  const handleCancel = () => {
    setValidationError("");
    setShow(false);
  };

  const handleOpen = () => {
    setShow(true);
    setTempDate(value || new Date());
    setValidationError("");
  };

  const displayError = validationError || error;

  return (
    <View className="mb-4">
      {Platform.OS === "web" ? (
        <input
          type="date"
          value={value ? value.toISOString().split("T")[0] : ""}
          onChange={(e) => {
            const date = new Date(e.target.value);
            if (validateDate(date)) onChange(date);
          }}
          style={{
            width: "100%",
            borderWidth: 1,
            borderColor: displayError ? "#EF4444" : "#D1D5DB",
            borderRadius: 12,
            padding: 12,
            fontSize: 16,
          }}
        />
      ) : (
        <TouchableOpacity
          onPress={handleOpen}
          className={`flex-row justify-between items-center border rounded-xl px-4 py-3 bg-white ${
            displayError ? "border-[#EF4444]" : "border-gray-300"
          }`}
        >
          <Text
            className={`text-base ${value ? "text-gray-900" : "text-gray-400"}`}
          >
            {value
              ? value.toLocaleDateString("en-US", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              : "Select date"}
          </Text>
          <Calendar size={20} color={displayError ? "#EF4444" : "#737373"} />
        </TouchableOpacity>
      )}

      {show && Platform.OS === "ios" && (
        <Modal transparent animationType="fade">
          <TouchableOpacity
            className="flex-1 bg-black/30 justify-center items-center"
            activeOpacity={1}
            onPressOut={handleCancel}
          >
            <TouchableOpacity
              activeOpacity={1}
              className="bg-white rounded-2xl p-4 w-[90%]"
            >
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={handleChangePicker}
              />

              {validationError && (
                <Text className="text-[#EF4444] text-sm mt-2 text-center">
                  {validationError}
                </Text>
              )}

              <View className="flex-row justify-between mt-4 gap-3">
                <TouchableOpacity
                  onPress={handleCancel}
                  className="flex-1 border border-[#FCBC03] py-3 rounded-xl"
                >
                  <Text className="text-center text-[#FCBC03] text-base font-semibold">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleConfirm}
                  className="flex-1 bg-[#FCBC03] py-3 rounded-xl"
                >
                  <Text className="text-center text-white text-base font-semibold">
                    Confirm
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}

      {show && Platform.OS === "android" && (
        <DateTimePicker
          value={tempDate}
          mode="date"
          display="default"
          onChange={handleChangePicker}
        />
      )}
    </View>
  );
}
