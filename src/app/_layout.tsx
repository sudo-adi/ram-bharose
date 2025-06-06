import { Stack, useRouter, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "@/components/ui/common/SplashScreen";
import SplashScreen2 from "@/components/ui/common/SplashScreen2";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootLayout() {
  const [splashState, setSplashState] = useState("splash1"); // "splash1", "splash2", "done"

  useEffect(() => {
    // Show first splash screen for 2 seconds
    const timer1 = setTimeout(() => {
      setSplashState("splash2");

      // Show second splash screen for 1.5 seconds
      const timer2 = setTimeout(() => {
        setSplashState("done");
      }, 1500);

      return () => clearTimeout(timer2);
    }, 1500);

    return () => clearTimeout(timer1);
  }, []);

  if (splashState === "splash1") {
    return (
      <SafeAreaProvider>
        <SplashScreen />
      </SafeAreaProvider>
    );
  }

  if (splashState === "splash2") {
    return (
      <SafeAreaProvider>
        <SplashScreen2 />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <AuthenticationWrapper />
    </SafeAreaProvider>
  );
}

function AuthenticationWrapper() {
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const userPhone = await AsyncStorage.getItem("userPhone");

      if (!userPhone) {
        if (!pathName.includes("/(auth)")) {
          router.replace("/(auth)/login");
        }
        return;
      }

      if (pathName.includes("/(auth)")) {
        router.replace("/(tabs)");
      }
    };

    checkAuth();
  }, [pathName]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Root routes */}
      <Stack.Screen name="index" options={{ headerShown: false }} />

      {/* Group routes - use the correct format */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />

      {/* Individual routes */}
      <Stack.Screen
        name="birthdays"
        options={{
          headerShown: true,
          headerTitle: "Birthday Reminders",
          headerTintColor: "#f97316",
          presentation: "card",
          headerBackTitle: "Explore",
        }}
      />
      <Stack.Screen
        name="donations"
        options={{
          headerShown: true,
          headerTitle: "Donations",
          headerTintColor: "#f97316",
          presentation: "card",
          headerBackTitle: "Explore",
        }}
      />
      <Stack.Screen
        name="family-profile"
        options={{
          headerShown: true,
          headerTitle: "Family Profile",
          headerTintColor: "#f97316",
          headerBackTitle: "Explore",
        }}
      />
      <Stack.Screen
        name="member-detail"
        options={{
          headerShown: true,
          headerTitle: "Member Details",
          headerTintColor: "#f97316",
          presentation: "card",
          headerBackTitle: "Members",
        }}
      />
      {/* Make sure all routes are registered here */}
    </Stack>
  );
}
