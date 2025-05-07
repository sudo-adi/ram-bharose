import {
  ClerkProvider,
  ClerkLoaded,
  useAuth,
  useUser,
} from "@clerk/clerk-expo";
import { Stack, useRouter, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SplashScreen from "@/components/ui/common/SplashScreen";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import React from "react";
import { supabase } from "@/lib/supabase";
import { Platform } from "react-native";
import * as WebBrowser from "expo-web-browser";

// This is critical - must be called at root level
WebBrowser.maybeCompleteAuthSession();

export default function RootLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

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
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}
      tokenCache={tokenCache}
      // Use signInFallbackRedirectUrl instead of fallbackRedirectUrl
      signInFallbackRedirectUrl={Platform.select({
        native: "kms://oauth-native-callback",
        default: "https://master-reptile-14.clerk.accounts.dev/oauth-callback",
      })}
    >
      <ClerkLoaded>
        <SafeAreaProvider>
          <AuthenticationWrapper />
        </SafeAreaProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

function AuthenticationWrapper() {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const pathName = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Handle authentication state and routing
    const handleAuthState = async () => {
      if (!isLoaded) return;

      // For debugging
      console.log("Auth state:", { isSignedIn, pathName });

      // Handle unauthenticated state
      if (!isSignedIn) {
        if (!pathName.includes("/(auth)")) {
          router.replace("/(auth)/login");
        }
        return;
      }

      // Check if user has completed family verification
      if (isSignedIn && user) {
        try {
          const { data: familyMember, error } = await supabase
            .from("profiles")
            .select("id")
            .eq("email", user.emailAddresses[0]?.emailAddress)
            .single();

          console.log("Family member check:", familyMember, error);

          if (!familyMember && !pathName.includes("family-verification")) {
            router.replace("/(auth)/family-verification");
            return;
          }

          // If user is verified and on an auth page, redirect to tabs
          if (familyMember && pathName.includes("/(auth)")) {
            router.replace("/(tabs)");
            return;
          }

          // NEW CODE: If user is verified and on the root path, redirect to tabs
          if (familyMember && pathName === "/") {
            router.replace("/(tabs)");
            return;
          }
        } catch (err) {
          console.error("Error checking family verification:", err);
        }
      }
    };

    handleAuthState();
  }, [isLoaded, isSignedIn, pathName, user, router]);

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
