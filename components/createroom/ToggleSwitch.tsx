import React, { useEffect, useRef } from "react";
import { View, Text, TouchableWithoutFeedback, Animated, Easing } from "react-native";

interface ToggleSwitchProps {
    label: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    description?: string;
}

export default function ToggleSwitch({
    label,
    value,
    onValueChange,
    description,
}: ToggleSwitchProps) {
    const animation = useRef(new Animated.Value(value ? 1 : 0)).current;

    useEffect(() => {
        Animated.timing(animation, {
            toValue: value ? 1 : 0,
            duration: 200,
            easing: Easing.out(Easing.circle),
            useNativeDriver: false,
        }).start();
    }, [value]);

    const translateX = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 35],
    });

    const backgroundColor = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ["#d1d5db", "#FFD661"],
    });

    return (
        <View className="mb-5 flex flex-row justify-between items-center">
            <View>
                <Text className="text-lg font-medium text-[#171717] mb-1">{label}</Text>
                {description && (
                    <Text className="text-sm text-gray-500 mb-2">{description}</Text>
                )}
            </View>

            <TouchableWithoutFeedback onPress={() => onValueChange(!value)} className="flex items-center justify-center">
                <Animated.View
                    style={{
                        width: 70,
                        height: 35,
                        borderRadius: 100,
                        backgroundColor,
                        padding: 3,
                    }}
                >
                    <Animated.View
                        style={{
                            width: 29,
                            height: 29,
                            borderRadius: 100,
                            backgroundColor: "#fff",
                            transform: [{ translateX }],
                        }}
                    />
                </Animated.View>
            </TouchableWithoutFeedback>
        </View>
    );
}
