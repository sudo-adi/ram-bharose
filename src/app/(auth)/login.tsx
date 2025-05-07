import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Platform,
  Alert,
} from "react-native";
import { useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

// Warm up browser hook
export const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

export default function Login() {
  useWarmUpBrowser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use useOAuth with proper configuration
  const { startOAuthFlow } = useOAuth({
    strategy: "oauth_google",
  });

  const onPress = async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("Starting OAuth flow for Google authentication...");

      // Clear any existing browser sessions that might interfere
      await WebBrowser.dismissBrowser();

      // Start the OAuth flow with explicit configuration
      const { createdSessionId, setActive, signIn, signUp } =
        await startOAuthFlow({
          // Explicitly define the redirect URL to match app.json scheme config
          redirectUrl: Platform.select({
            native: "kms://oauth-native-callback",
          }),
          // Remove browserOptions as it's not supported in the current version
        });

      console.log("OAuth flow completed. Session created:", !!createdSessionId);

      if (createdSessionId) {
        console.log("Setting session active and navigating...");
        // Set session as active
        if (setActive) {
          await setActive({ session: createdSessionId });
        }

        // Redirect to family verification instead of tabs
        // The AuthenticationWrapper will handle further redirection if already verified
        setTimeout(
          () => {
            router.replace("/(auth)/family-verification");
          },
          Platform.OS === "android" ? 500 : 100
        );
      } else if (signIn || signUp) {
        console.log("Need to complete the sign in/up flow");
        try {
          if (signIn) {
            const result = await signIn.create({});
            await setActive?.({ session: result.createdSessionId });
            router.replace("/(auth)/family-verification");
          } else if (signUp) {
            const result = await signUp.create({});
            await setActive?.({ session: result.createdSessionId });
            router.replace("/(auth)/family-verification");
          }
        } catch (authError) {
          console.error("Authentication completion error:", authError);
          setError("Failed to complete authentication. Please try again.");
          Alert.alert(
            "Authentication Error",
            "We couldn't complete the sign-in process. Please try again."
          );
        }
      } else {
        console.error("No session or sign-in/up flow created");
        setError("Failed to authenticate. Please try again.");
        Alert.alert(
          "Sign-in Failed",
          "We couldn't authenticate with Google. Please try again later."
        );
      }
    } catch (err) {
      console.error("OAuth error:", err);
      setError("Failed to sign in with Google. Please try again.");
      Alert.alert(
        "Sign-in Error",
        "There was a problem connecting to Google. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <View className="items-center mb-12">
        <Image
          source={require("@/assets/icon.png")}
          className="w-32 h-32"
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-gray-800 mt-6">
          Welcome to KMS
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          Connect with your community and stay updated with family events
        </Text>
      </View>

      {isLoading ? (
        <View className="flex-row justify-center items-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : (
        <>
          <TouchableOpacity
            onPress={onPress}
            className="bg-orange-500 py-4 rounded-xl flex-row justify-center items-center"
          >
            <Ionicons
              name="logo-google"
              size={20}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text className="text-white font-semibold text-lg">
              Continue with Google
            </Text>
          </TouchableOpacity>

          {error && (
            <Text className="text-red-500 text-center mt-4">{error}</Text>
          )}

          <Text className="text-gray-500 text-center text-xs mt-4">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </>
      )}
    </View>
  );
}
