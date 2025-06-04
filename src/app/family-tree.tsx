import React from "react";
import { Stack } from "expo-router";
import FamilyTree from "@/components/features/family-tree/page";

export default function FamilyTreePage() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Family Tree",
          headerTintColor: "#f97316",
          presentation: "card",
          headerBackTitle: "Explore",
        }}
      />
      <FamilyTree />
    </>
  );
}
