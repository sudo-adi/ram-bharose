import React from "react";
import { View, Text, Image, StatusBar } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import icon from "@/../assets/icon-two.png"; // Not ideal

export default function SplashScreen2() {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-red-100" // Changed from gradient to solid red background
      style={{ paddingTop: top, paddingBottom: bottom }}
    >
      <StatusBar barStyle="light-content" backgroundColor="#FF892E" />
      <View className="flex-1 items-center justify-center">
        <Image source={icon} className="w-64 h-64" resizeMode="contain" />
        <Text className="text-purple-500 text-4xl font-bold p-4">
          KMS Connect
        </Text>
        <Text className="text-black-500 text-xl font-bold p-4">
          Donated and Managed by
        </Text>
        <Text className="text-center text-black-500 text-2xl font-bold p-4">
          Aadhya Chhatra Manda
        </Text>
      </View>

      <View className="items-center pb-6 text-black">
        <Text className=" text-sm">Version 2.0</Text>
        <Text className="text-xs mt-1">
          This app is in beta mode there may be some bugs
        </Text>
      </View>
    </View>
  );
}
