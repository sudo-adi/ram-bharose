import React from "react";
import { Stack } from "expo-router";
import DoctorsDirectory from "@/components/features/doctors-directory/page";

export default function DoctorsDirectoryPage() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Doctors Directory",
          headerTintColor: "#f97316",
          presentation: "card",
          headerBackTitle: "Explore",
        }}
      />
      <DoctorsDirectory />
    </>
  );
}
