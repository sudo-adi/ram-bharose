import ApplicationForm from "@/components/features/application-form/ApplicationForm";
import React from "react";
import { Stack } from "expo-router";

export default function ApplicationFormPage() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Application Form",
          headerTintColor: "#f97316",
          presentation: "card",
          headerBackTitle: "Explore",
        }}
      />
      <ApplicationForm />
    </>
  );
}
