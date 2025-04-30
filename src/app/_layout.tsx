import { ClerkProvider, useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "@/components/ui/common/SplashScreen";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <SplashScreen />
      </SafeAreaProvider>
    );
  }
  return (
    <ClerkProvider
      tokenCache={tokenCache}
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <SafeAreaProvider>
        <AuthenticationWrapper />
      </SafeAreaProvider>
    </ClerkProvider>
  );
}

function AuthenticationWrapper() {
  const { isLoaded, isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn) {
      router.push("/(tabs)");
    }
  }, [isLoaded]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="login"
        options={{
          headerShown: false,
          presentation: "fullScreenModal",
        }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
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
    </Stack>
  );
}
