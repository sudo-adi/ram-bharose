import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type EmptyStateProps = {
  message?: string;
};

const EmptyState = ({ message = "No businesses found" }: EmptyStateProps) => {
  return (
    <View className="flex-1 items-center justify-center bg-pink-50">
      <Ionicons name="business-outline" size={48} color="#f9a8d4" />
      <Text className="text-pink-400 mt-4 text-center">{message}</Text>
    </View>
  );
};

export default EmptyState;
