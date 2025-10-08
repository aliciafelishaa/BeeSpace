import React, { useState, useEffect } from "react"
import { View, Text, TouchableOpacity, Platform, Modal } from "react-native"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Calendar, Trash2 } from "lucide-react-native"

interface DatePickerInputProps {
    label: string
    value: string
    onChange: (date: string) => void
    error?: string
    required?: boolean
    onOpen?: () => void
}

export default function DatePickerInput({
    label,
    value,
    onChange,
    error,
    required = false,
    onOpen,
}: DatePickerInputProps) {
    const [show, setShow] = useState(false)
    const [selectedDate, setSelectedDate] = useState<Date | null>(
        value ? new Date(value) : null
    )
    const [internalError, setInternalError] = useState("")

    useEffect(() => {
        setInternalError(error || "")
    }, [error])

    const today = new Date()
    const minimumDate = new Date()
    const maximumDate = new Date()
    maximumDate.setDate(maximumDate.getDate() + 365)

    const handleChangePicker = (event: any, date?: Date) => {
        if (event.type === "dismissed") return setShow(false)
        if (date) setSelectedDate(date)
    }

    const handleConfirm = () => {
        if (!selectedDate) return

        const formatted = selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
        })

        onChange(formatted)
        setShow(false)
    }

    const handleDelete = () => {
        onChange("")
        setSelectedDate(null)
        setInternalError("")
        setShow(false)
    }

    const handleOpen = () => {
        setShow(true)
        setInternalError("")

        if (!selectedDate) {
            setSelectedDate(today)
        }

        if (onOpen) onOpen()
    }

    return (
        <View className="mb-4">
            <Text className="text-lg font-medium text-[#171717] mb-2">
                {label} {required && <Text className="text-[#EF4444]">*</Text>}
            </Text>

            <TouchableOpacity
                onPress={handleOpen}
                className={`flex-row justify-between items-center border rounded-xl px-4 py-3 bg-white ${internalError ? "border-[#EF4444]" : "border-gray-300"}`}
            >
                <Text className={`text-base ${value ? "text-gray-900" : "text-gray-400"}`}>
                    {value || "Select date"}
                </Text>
                <Calendar size={20} />
            </TouchableOpacity>

            {internalError !== "" && (<Text className="text-[#EF4444] text-sm mt-1">{internalError}</Text>)}

            {show && (
                <Modal transparent animationType="fade">
                    <TouchableOpacity
                        className="flex-1 bg-black/30 justify-center items-center"
                        activeOpacity={1}
                        onPressOut={() => setShow(false)}
                    >
                        <View className="bg-white rounded-2xl p-4 w-[90%]">
                            <DateTimePicker
                                value={selectedDate || today}
                                mode="date"
                                display={Platform.OS === "ios" ? "spinner" : "default"}
                                onChange={handleChangePicker}
                                minimumDate={minimumDate}
                                maximumDate={maximumDate}
                            />

                            {internalError !== "" && (<Text className="text-[#EF4444] text-md mt-2 text-center">{internalError}</Text>)}

                            <View className="flex-row justify-between mt-4">
                                <TouchableOpacity
                                    onPress={handleDelete}
                                    className="flex-1 flex-row justify-center items-center border border-[#FCBC03] py-3 rounded-xl mr-2"
                                >
                                    <Trash2 size={18} color="#FCBC03" />
                                    <Text className="text-[#FCBC03] text-base font-semibold ml-2">Delete</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={handleConfirm}
                                    className="flex-1 bg-[#FCBC03] py-3 rounded-xl ml-2"
                                >
                                    <Text className="text-center text-white text-lg font-semibold">Done</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}
        </View>
    )
}
