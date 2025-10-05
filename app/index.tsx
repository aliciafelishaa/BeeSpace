import "../global.css"
import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white gap-5">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
      <Link href="/login">
        <Text>Go to Login</Text>
      </Link>
      <Link href="/register">
        <Text>Go to register</Text>
      </Link>
      <Link href="/boarding">
        <Text>Go to boarding</Text>
      </Link>
    </View>
  );
}