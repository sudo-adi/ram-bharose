import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ViewToggleProps = {
  viewType: "grid" | "list";
  onViewTypeChange: (type: "grid" | "list") => void;
  totalCount: number;
};

const ViewToggle = ({
  viewType,
  onViewTypeChange,
  totalCount,
}: ViewToggleProps) => {
  return (
    <View className="flex-row justify-between items-center">
      <Text className="text-gray-500 text-sm">{totalCount} members found</Text>
      <View className="flex-row bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
        <TouchableOpacity
          onPress={() => onViewTypeChange("grid")}
          className={`px-4 py-2 flex-row items-center ${
            viewType === "grid" ? "bg-orange-500" : ""
          }`}
        >
          <Ionicons
            name="grid-outline"
            size={16}
            color={viewType === "grid" ? "#ffffff" : "#6b7280"}
            style={{ marginRight: 4 }}
          />
          <Text
            className={
              viewType === "grid"
                ? "text-white font-medium text-sm"
                : "text-gray-600 text-sm"
            }
          >
            Grid
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onViewTypeChange("list")}
          className={`px-4 py-2 flex-row items-center ${
            viewType === "list" ? "bg-orange-500" : ""
          }`}
        >
          <Ionicons
            name="list-outline"
            size={16}
            color={viewType === "list" ? "#ffffff" : "#6b7280"}
            style={{ marginRight: 4 }}
          />
          <Text
            className={
              viewType === "list"
                ? "text-white font-medium text-sm"
                : "text-gray-600 text-sm"
            }
          >
            List
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ViewToggle;
