import React from "react";
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from "react-native";
import { useSSO } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";


// Warm up browser hook
export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Warm up the android browser to improve UX
    // https://docs.expo.dev/guides/authentication/#improving-user-experience
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  useWarmUpBrowser();
  const router = useRouter();
  const { startSSOFlow } = useSSO();
  const [isLoading, setIsLoading] = useState(false);

  const onPress = async () => {
    setIsLoading(true);
    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: "ram-bharose"
      });

      const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
        router.replace("/(tabs)");
      } else if (signIn || signUp) {
        try {
          if (signIn) {
            const result = await signIn.create({});
            await setActive?.({ session: result.createdSessionId });
            router.replace("/(tabs)");
          } else if (signUp) {
            const result = await signUp.create({});
            await setActive?.({ session: result.createdSessionId });
            router.replace("/(tabs)");
          }
        } catch (authError) {
          console.error("Authentication completion error:", authError);
          alert("Failed to complete authentication. Please try again.");
        }
      } else {
        throw new Error("Failed to create session or authenticate");
      }
    } catch (err) {
      console.error("OAuth error:", err);
      alert("Failed to sign in with Google. Please try again.");
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
          Welcome to Ram Bharose
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
        <TouchableOpacity
          onPress={onPress}
          className="bg-orange-500 py-4 rounded-xl flex-row justify-center items-center"
        >
          <Image
            source={{ uri: "https://www.google.com/favicon.ico" }}
            className="w-5 h-5 mr-2"
          />
          <Text className="text-white font-semibold text-lg">
            Continue with Google
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
