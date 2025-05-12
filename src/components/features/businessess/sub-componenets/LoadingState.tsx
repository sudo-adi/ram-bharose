import React from "react";
import { View, Text, ActivityIndicator } from "react-native";

const LoadingState = () => {
  return (
    <View className="flex-1 items-center justify-center bg-orange-50">
      <View className="items-center">
        <ActivityIndicator size="large" color="#ea580c" />
        <Text className="text-orange-600 mt-4 font-medium">
          Loading businesses...
        </Text>
        <View className="w-24 h-1 bg-gray-100 rounded-full mt-3 overflow-hidden">
          <View
            className="h-full bg-orange-500 rounded-full animate-pulse"
            style={{ width: "70%" }}
          />
        </View>
      </View>
    </View>
  );
};

export default LoadingState;
