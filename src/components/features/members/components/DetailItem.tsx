import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type DetailItemProps = {
  label: string;
  value: string;
  icon: string;
};

const DetailItem = ({ label, value, icon }: DetailItemProps) => {
  if (!value || value === "Not available" || value === "Unknown") return null;

  return (
    <View className="flex-row items-center mx-2 py-3 border-b border-gray-100">
      <View className="w-10 items-center">
        <Ionicons name={icon as any} size={20} color="#f97316" />
      </View>
      <View className="flex-1">
        <Text className="text-gray-500 text-xs">{label}</Text>
        <Text className="text-gray-800 font-medium">{value}</Text>
      </View>
    </View>
  );
};

export default DetailItem;
