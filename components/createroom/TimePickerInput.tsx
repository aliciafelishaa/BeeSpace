import React, { useState } from "react"
import { View, Text, TouchableOpacity, Platform, Modal } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Clock, Trash2 } from "lucide-react-native"

interface TimeRangePickerInputProps {
    label: string
    startValue: string
    endValue: string
    onChangeStart: (time: string) => void
    onChangeEnd: (time: string) => void
    error?: string
    required?: boolean
}

export default function TimeRangePickerInput({
    label,
    startValue,
    endValue,
    onChangeStart,
    onChangeEnd,
    error,
    required = false,
}: TimeRangePickerInputProps) {
    const [showPicker, setShowPicker] = useState<"start" | "end" | null>(null)
    const [tempTime, setTempTime] = useState<Date>(new Date())
    const [tempError, setTempError] = useState("")

    const parseTime = (timeStr: string) => {
        const [h, m] = timeStr.split(":").map(Number)
        const now = new Date()
        now.setHours(h, m, 0, 0)
        return now
    }

    const formatTime = (time: Date) =>
        time.toTimeString().slice(0, 5)

    const handleChange = (event: any, time?: Date) => {
        if (time) setTempTime(time)
        if (Platform.OS !== "ios" && event.type === "set" && time)
            handleConfirm(time)
    }

    const handleConfirm = (time: Date) => {
        const formatted = formatTime(time)
        setTempError("")

        if (showPicker === "start") {
            // validasi start tidak lebih dari end
            if (endValue && parseTime(endValue).getTime() - time.getTime() < 5 * 60 * 1000) {
                setTempError("Start time must be at least 5 minutes before end time")
                return
            }
            onChangeStart(formatted)
            // otomatis reset end jika end kurang dari 5 menit
            if (endValue && parseTime(endValue).getTime() - time.getTime() < 5 * 60 * 1000) {
                onChangeEnd("")
            }
        } else if (showPicker === "end") {
            if (!startValue) return
            const start = parseTime(startValue)
            if (time.getTime() - start.getTime() < 5 * 60 * 1000) {
                setTempError("End time must be at least 5 minutes after start time")
                return
            }
            onChangeEnd(formatted)
        }

        setShowPicker(null)
    }

    const handleDelete = () => {
        if (showPicker === "start") {
            onChangeStart("")
            if (endValue) onChangeEnd("")
        }
        if (showPicker === "end") onChangeEnd("")

        setTempError("")
        setTempTime(new Date())
        setShowPicker(null)
    }


    const openPicker = (type: "start" | "end") => {
        if (type === "end") {
            if (endValue) {
                const end = parseTime(endValue)
                const start = parseTime(startValue)
                setTempTime(end.getTime() - start.getTime() >= 5 * 60 * 1000 ? end : new Date(start.getTime() + 5 * 60 * 1000))
            } else if (startValue) {
                const start = parseTime(startValue)
                setTempTime(new Date(start.getTime() + 5 * 60 * 1000))
            } else {
                setTempTime(new Date())
            }
        }

        setShowPicker(type)

        if (type === "start") {
            const currentValue = startValue ? parseTime(startValue) : new Date()
            setTempTime(currentValue)
        } else {
            // end time
            if (endValue) {
                setTempTime(parseTime(endValue))
            } else if (startValue) {
                const start = parseTime(startValue)
                const fiveMinutesLater = new Date(start.getTime() + 5 * 60 * 1000)
                setTempTime(fiveMinutesLater)
            } else {
                setTempTime(new Date())
            }
        }
    }

    return (
        <View className="mb-4">
            <Text className="text-lg font-medium text-[#171717] mb-2">
                {label} {required && <Text className="text-[#EF4444]">*</Text>}
            </Text>

            <View className="flex-row items-center justify-between">
                <TouchableOpacity
                    onPress={() => openPicker("start")}
                    className={`flex-1 flex-row justify-between items-center border rounded-xl px-4 py-3 bg-white ${error ? "border-[#EF4444]" : "border-gray-300"
                        }`}
                >
                    <Text
                        className={`text-base ${startValue ? "text-gray-900" : "text-gray-400"
                            }`}
                    >
                        {startValue || "Start"}
                    </Text>
                    <Clock size={20} />
                </TouchableOpacity>

                <Text className="mx-2 text-lg font-semibold text-gray-600">-</Text>

                <TouchableOpacity
                    onPress={() => openPicker("end")}
                    disabled={!startValue} // disable kalau start belum dipilih
                    className={`flex-1 flex-row justify-between items-center border rounded-xl px-4 py-3 bg-white ${!startValue
                        ? "bg-gray-100 border-gray-300"
                        : error
                            ? "border-[#EF4444]"
                            : "border-gray-300"
                        }`}
                >
                    <Text
                        className={`text-base ${endValue ? "text-gray-900" : "text-gray-400"
                            }`}
                    >
                        {endValue || "End"}
                    </Text>
                    <Clock size={20} />
                </TouchableOpacity>

            </View>

            {error && (
                <Text className="text-[#EF4444] text-sm mt-1">{error}</Text>
            )}

            {showPicker && (
                <Modal transparent animationType="fade">
                    <TouchableOpacity
                        className="flex-1 bg-black/30 justify-center items-center"
                        activeOpacity={1}
                        onPressOut={() => setShowPicker(null)}
                    >
                        <View className="bg-white rounded-2xl p-4">
                            <DateTimePicker
                                value={tempTime}
                                mode="time"
                                is24Hour={true}
                                display={Platform.OS === "ios" ? "spinner" : "default"}
                                onChange={handleChange}
                                minimumDate={
                                    showPicker === "end" && startValue
                                        ? new Date(parseTime(startValue).getTime() + 5 * 60 * 1000) // start + 5 menit
                                        : undefined
                                }
                            />


                            {tempError !== "" && (
                                <Text className="text-[#EF4444] text-md mt-2 text-center">
                                    {tempError}
                                </Text>
                            )}

                            <View className="flex-row justify-between mt-4">
                                <TouchableOpacity
                                    onPress={handleDelete}
                                    className="flex-1 flex-row justify-center items-center border border-[#FCBC03] py-3 rounded-xl mr-2"
                                >
                                    <Trash2 size={18} color="#FCBC03" />
                                    <Text className="text-[#FCBC03] text-base font-semibold ml-2">
                                        Delete
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => handleConfirm(tempTime)}
                                    className="flex-1 bg-[#FCBC03] py-3 rounded-xl ml-2"
                                >
                                    <Text className="text-center text-white text-lg font-semibold">
                                        Done
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}

            {error && <Text className="text-[#EF4444] text-sm mt-1">{error}</Text>}
        </View>
    )
}
