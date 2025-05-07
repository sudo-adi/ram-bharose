import React from "react";
import { View, Text } from "react-native";

const ErrorState = () => {
  return (
    <View className="flex-1 items-center justify-center bg-pink-50">
      <Text className="text-red-600">Error loading businesses</Text>
    </View>
  );
};

export default ErrorState;
