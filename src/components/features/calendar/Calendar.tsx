import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function CalendarContent() {
  return (
    <View className="px-4 py-6">
      <Text className="text-2xl font-bold mb-4">Calendar</Text>

      <View className="bg-gray-50 rounded-lg p-4 mb-6">
        <View className="flex-row justify-between mb-4">
          <TouchableOpacity>
            <Ionicons name="chevron-back" size={24} color="#666" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold">June 2023</Text>
          <TouchableOpacity>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <Text className="text-center text-gray-500 mt-4">
          Calendar view will be displayed here
        </Text>
      </View>

      <View className="mt-4">
        <Text className="font-semibold text-lg mb-2">Upcoming Events</Text>
        <View className="bg-gray-50 rounded-lg p-4 mb-2">
          <Text className="font-medium">Team Meeting</Text>
          <Text className="text-gray-500">Tomorrow, 10:00 AM</Text>
        </View>
        <View className="bg-gray-50 rounded-lg p-4">
          <Text className="font-medium">Project Deadline</Text>
          <Text className="text-gray-500">Friday, 5:00 PM</Text>
        </View>
      </View>
    </View>
  );
}
