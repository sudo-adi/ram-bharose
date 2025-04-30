import { View, Text, TouchableOpacity, Image } from "react-native";
import { useSSO, useUser, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

// Warm up browser hook
export const useWarmUpBrowser = () => {
  useEffect(() => {
    // Preloads the browser for Android devices to reduce authentication load time
    void WebBrowser.warmUpAsync();
    return () => {
      // Cleanup: closes browser when component unmounts
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession();

export default function Login() {
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isSignedIn) {
      router.push("/(tabs)");
    }
  }, [isSignedIn]);

  const onPress = async () => {
    try {
      const { createdSessionId, setActive, signIn, signUp } =
        await startSSOFlow({
          strategy: "oauth_google",
          redirectUrl: AuthSession.makeRedirectUri(),
        });

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.push("/(tabs)");
      } else {
        console.log("Additional authentication steps required");
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  };

  if (isSignedIn && user) {
    return (
      <View className="flex-1 bg-white p-6 justify-center">
        <View className="items-center mb-12">
          <Image
            source={{ uri: user.imageUrl }}
            className="w-24 h-24 rounded-full"
          />
          <Text className="text-2xl font-bold text-gray-800 mt-6">
            Welcome back, {user.firstName}!
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            {user.emailAddresses[0].emailAddress}
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)")}
            className="bg-orange-500 py-4 px-8 rounded-xl mt-6"
          >
            <Text className="text-white font-semibold text-lg">
              Go to Homepage
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
    </View>
  );
}
