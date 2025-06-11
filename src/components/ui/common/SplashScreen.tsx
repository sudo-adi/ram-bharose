import React from "react";
import { View, Text, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SplashScreen() {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-red-100" // Changed from gradient to solid red background
      style={{ paddingTop: top, paddingBottom: bottom }}
    >
      <View className="flex-1 items-center justify-center">
        <Image
          source={require("@/assets/icon.png")}
          className="w-64 h-64"
          resizeMode="contain"
        />
        <Text className="text-purple-500 text-4xl font-bold p-4">
          KMS Connect
        </Text>
        {/* <Text className="text-black-500 text-xl font-bold p-4"></Text> */}
        <Text className="text-center text-black-500 text-2xl font-bold p-4">
          Shri Kutchi Maheshwari Madhyastha Mahajan Samiti
        </Text>
      </View>

      <View className="items-center pb-6 text-black/50">
        <Text className="text-sm">Version 2.0</Text>
        <Text className="text-xs mt-1">
          This app is in beta mode there may be some bugs
        </Text>
      </View>
    </View>
  );
}
