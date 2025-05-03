import React from "react";
import { Stack } from "expo-router";
import Committees from "@/components/features/committees/page";

export default function CommitteesPage() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Committees",
          headerTintColor: "#f97316",
          presentation: "card",
          headerBackTitle: "Explore",
        }}
      />
      <Committees />
    </>
  );
}
