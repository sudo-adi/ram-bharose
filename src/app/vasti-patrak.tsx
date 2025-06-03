import React from "react";
import { Stack } from "expo-router";
import VastiPatrak from "@/components/features/vasti-patrak/page";

export default function VastiPatrakPage() {
    return (
        <>
            <Stack.Screen
                options={{
                    headerShown: true,
                    headerTitle: "Vasti Patrak",
                    headerTintColor: "#f97316",
                    presentation: "card",
                    headerBackTitle: "Explore",
                }}
            />
            <VastiPatrak />
        </>
    );
}
