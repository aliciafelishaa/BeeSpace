import React, { useState } from "react"
import { View, Text, TouchableOpacity, Platform, Modal } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Clock } from "lucide-react-native"

interface TimePickerInputProps {
    label: string
    startValue: string
    endValue: string
    onChangeStart: (time: string) => void
    onChangeEnd: (time: string) => void
    selectedDate?: Date
    error?: string
    required?: boolean
    onFocus?: () => void
}

export default function TimePickerInput({
    label,
    startValue,
    endValue,
    onChangeStart,
    onChangeEnd,
    selectedDate,
    error,
    required = false,
    onFocus,
}: TimePickerInputProps) {
    const [showPicker, setShowPicker] = useState<"start" | "end" | null>(null)
    const [tempTime, setTempTime] = useState<Date>(new Date())
    const [validationError, setValidationError] = useState("")

    React.useEffect(() => {
        if (!selectedDate) return

        const minStartTime = getMinimumStartTime()

        if (startValue && minStartTime) {
            const start = parseTime(startValue)
            if (start < minStartTime) {
                onChangeStart("")
                onChangeEnd("")
            }
        }
    }, [selectedDate])

    const parseTime = (timeStr: string) => {
        const [h, m] = timeStr.split(":").map(Number)
        const now = new Date()
        now.setHours(h, m, 0, 0)
        return now
    }

    const formatTime = (time: Date) => {
        const hours = time.getHours().toString().padStart(2, "0")
        const minutes = time.getMinutes().toString().padStart(2, "0")
        return `${hours}:${minutes}`
    }

    const isToday = () => {
        if (!selectedDate) return false
        const today = new Date()
        return (
            selectedDate.getDate() === today.getDate() &&
            selectedDate.getMonth() === today.getMonth() &&
            selectedDate.getFullYear() === today.getFullYear()
        )
    }

    const getMinimumStartTime = () => {
        if (!isToday()) return null
        const now = new Date()
        now.setSeconds(0, 0)
        now.setMinutes(now.getMinutes() + 5)
        return now
    }

    const getMinimumEndTime = () => {
        if (!startValue) return null
        const start = parseTime(startValue)
        start.setMinutes(start.getMinutes() + 10)
        return start
    }

    const validateStartTime = (time: Date) => {
        const minTime = getMinimumStartTime()
        if (minTime) {
            const selectedTime = new Date(time)
            selectedTime.setSeconds(0, 0)

            if (selectedTime < minTime) {
                setValidationError(
                    `Start time must be at least 5 minutes from now (${formatTime(minTime)})`
                )
                return false
            }
        }
        setValidationError("")
        return true
    }

    const validateEndTime = (time: Date) => {
        if (!startValue) {
            setValidationError("Please select start time first")
            return false
        }

        const start = parseTime(startValue)
        const selectedEnd = new Date(time)
        selectedEnd.setSeconds(0, 0)

        const diffMinutes = (selectedEnd.getTime() - start.getTime()) / (1000 * 60)

        if (diffMinutes < 10) {
            const minEnd = getMinimumEndTime()
            setValidationError(
                `End time must be at least 10 minutes after start time (min: ${formatTime(minEnd!)})`
            )
            return false
        }

        setValidationError("")
        return true
    }

    const handleChange = (event: any, time?: Date) => {
        if (Platform.OS === "android") {
            if (event.type === "set" && time) {
                handleConfirm(time)
            } else {
                setShowPicker(null)
            }
        } else if (time) {
            setTempTime(time)
        }
    }

    const handleConfirm = (time: Date) => {
        const formatted = formatTime(time)

        if (showPicker === "start") {
            if (validateStartTime(time)) {
                onChangeStart(formatted)
                if (endValue) {
                    const end = parseTime(endValue)
                    const selectedStart = new Date(time)
                    selectedStart.setSeconds(0, 0)
                    const diffMinutes = (end.getTime() - selectedStart.getTime()) / (1000 * 60)
                    if (diffMinutes < 10) {
                        onChangeEnd("")
                    }
                }
                setShowPicker(null)
            }
        } else if (showPicker === "end") {
            if (validateEndTime(time)) {
                onChangeEnd(formatted)
                setShowPicker(null)
            }
        }
    }

    const handleCancel = () => {
        setValidationError("")
        setShowPicker(null)
    }

    const openPicker = (type: "start" | "end") => {
        setValidationError("")
        if (onFocus) onFocus()

        if (type === "start") {
            const minTime = getMinimumStartTime()
            setTempTime(
                startValue
                    ? parseTime(startValue)
                    : minTime
                        ? minTime
                        : new Date()
            )
        } else {
            const minTime = getMinimumEndTime()
            setTempTime(
                endValue
                    ? parseTime(endValue)
                    : minTime
                        ? minTime
                        : new Date()
            )
        }

        setShowPicker(type)
    }

    const isStartDisabled = !selectedDate
    const isEndDisabled = !selectedDate || !startValue

    const displayError = validationError || error

    return (
        <View className="mb-4">
            <Text className="text-lg font-interMedium text-[#171717] mb-2">
                {label}
                {required && <Text className="text-[#EF4444]"> *</Text>}
            </Text>

            <View className="flex-row items-center justify-between">
                <TouchableOpacity
                    onPress={() => !isStartDisabled && openPicker("start")}
                    disabled={isStartDisabled}
                    className={`flex-1 flex-row justify-between items-center border rounded-xl px-4 py-3 ${isStartDisabled
                            ? "bg-gray-100 border-gray-300"
                            : displayError
                                ? "border-[#EF4444] bg-white"
                                : "border-gray-300 bg-white"
                        }`}
                >
                    <Text
                        className={`text-base ${startValue
                                ? "text-gray-900"
                                : isStartDisabled
                                    ? "text-gray-400"
                                    : "text-gray-400"
                            }`}
                    >
                        {startValue || "Start"}
                    </Text>
                    <Clock
                        size={20}
                        color={isStartDisabled ? "#D1D5DB" : "#737373"}
                    />
                </TouchableOpacity>

                <Text className="mx-2 text-lg font-semibold text-gray-600">-</Text>

                <TouchableOpacity
                    onPress={() => !isEndDisabled && openPicker("end")}
                    disabled={isEndDisabled}
                    className={`flex-1 flex-row justify-between items-center border rounded-xl px-4 py-3 ${isEndDisabled
                            ? "bg-gray-100 border-gray-300"
                            : displayError
                                ? "border-[#EF4444] bg-white"
                                : "border-gray-300 bg-white"
                        }`}
                >
                    <Text
                        className={`text-base ${endValue
                                ? "text-gray-900"
                                : isEndDisabled
                                    ? "text-gray-400"
                                    : "text-gray-400"
                            }`}
                    >
                        {endValue || "End"}
                    </Text>
                    <Clock
                        size={20}
                        color={isEndDisabled ? "#D1D5DB" : "#737373"}
                    />
                </TouchableOpacity>
            </View>

            {displayError && (
                <Text className="text-[#EF4444] text-sm mt-1">{displayError}</Text>
            )}

            {showPicker && Platform.OS === "ios" && (
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
                                value={tempTime}
                                mode="time"
                                is24Hour={true}
                                display="spinner"
                                onChange={handleChange}
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
                                    onPress={() => handleConfirm(tempTime)}
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

            {showPicker && Platform.OS === "android" && (
                <DateTimePicker
                    value={tempTime}
                    mode="time"
                    is24Hour={true}
                    display="default"
                    onChange={handleChange}
                />
            )}
        </View>
    )
}