import Businesses from "@/components/features/businessess/page";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

export default function BusinessesPage() {
  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Nari Sahas",
          headerTintColor: "##CD497D",
          presentation: "card",
          headerBackTitle: "Explore",
        }}
      />
      <SafeAreaView className="flex-1 bg-white">
        <Businesses />
      </SafeAreaView>
    </>
  );
}
