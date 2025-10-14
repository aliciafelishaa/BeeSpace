import React, { useEffect, useState } from "react"
import { Animated, Text, View, StyleSheet, Image } from "react-native"

type ToastProps = {
    message: string
    type?: "success" | "error" | "warning"
    onClose: () => void
}

export default function Toast({ message, type = "success", onClose }: ToastProps) {
    const [opacity] = useState(new Animated.Value(0))

    useEffect(() => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start()

        const timer = setTimeout(() => {
            Animated.timing(opacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => onClose())
        }, 3000)

        return () => clearTimeout(timer)
    }, [opacity, onClose])

    const bgColor =
        type === "success"
            ? "#10B981"
            : type === "error"
                ? "#EF4444"
                : "#F59E0B"

    const iconSource =
        type === "success"
            ? require("@/assets/images/icon-tick.svg")
            : type === "error"
                ? require("@/assets/images/icon-x.svg")
                : require("@/assets/images/icon-time.svg")

    return (
        <Animated.View
            style={[
                styles.container,
                { backgroundColor: bgColor, opacity },
            ]}
        >
            <Image source={iconSource} style={styles.icon} />
            <Text style={styles.text}>{message}</Text>
        </Animated.View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 50,
        left: "50%",
        transform: [{ translateX: -150 }],
        minWidth: 300,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 5,
        zIndex: 50,
    },
    icon: {
        width: 16,
        height: 16,
        marginRight: 8,
    },
    text: {
        color: "white",
        fontSize: 14,
        flexShrink: 1,
    },
})
