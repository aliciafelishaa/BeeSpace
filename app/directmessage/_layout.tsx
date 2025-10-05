import { Stack } from "expo-router";
import React from "react";

export default function DMLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, 
        contentStyle: { backgroundColor: "white" },
      }}
    >
    </Stack>
  );
}
