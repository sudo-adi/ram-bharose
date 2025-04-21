import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DirectoryContent() {
  const contacts = [
    { id: "1", name: "John Doe", role: "Developer" },
    { id: "2", name: "Jane Smith", role: "Designer" },
    { id: "3", name: "Robert Johnson", role: "Product Manager" },
    { id: "4", name: "Emily Davis", role: "Marketing" },
    { id: "5", name: "Michael Wilson", role: "Sales" },
  ];

  return (
    <View className="px-4 py-6 pt-14">
      <Text className="text-2xl font-bold mb-4">Directory</Text>

      <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2 mb-6">
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          className="flex-1 ml-2 text-base"
          placeholder="Search directory..."
          placeholderTextColor="#999"
        />
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity className="flex-row items-center py-3 border-b border-gray-100">
            <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center mr-3">
              <Text className="font-semibold">{item.name.charAt(0)}</Text>
            </View>
            <View>
              <Text className="font-medium">{item.name}</Text>
              <Text className="text-gray-500">{item.role}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
