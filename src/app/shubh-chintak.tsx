import React from "react";
import { Stack } from "expo-router";
import ShubhChintak from "@/components/features/shubh-chintak/page";

export default function ShubhChintakPage() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Shubh Chintak",
          headerTintColor: "#f97316",
          presentation: "card",
          headerBackTitle: "Explore",
        }}
      />
      <ShubhChintak />
    </>
  );
}
