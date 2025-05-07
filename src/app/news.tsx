import React from "react";
import { Stack } from "expo-router";
import News from "@/components/features/news/page";

export default function NewsPage() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "News & Updates",
          headerTintColor: "#f97316",
          presentation: "card",
          headerBackTitle: "Explore",
        }}
      />
      <News />
    </>
  );
}
