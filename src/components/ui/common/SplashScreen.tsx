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
      </View>

      <View className="items-center pb-6">
        <Text className="text-white/70 text-sm">Version 0.0.1</Text>
      </View>
    </View>
  );
}
