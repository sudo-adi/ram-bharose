import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ApplicationForm() {
  const [activeTab, setActiveTab] = useState("event");

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-5 pt-14 pb-4">
        <Text className="text-2xl font-bold text-gray-800">
          Application Form
        </Text>
        <Text className="text-gray-500 mt-1">
          Submit your event or donation request
        </Text>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row border-b border-gray-200 mx-4">
        <TouchableOpacity
          className={`flex-1 items-center py-3 border-b-2 ${
            activeTab === "event" ? "border-orange-500" : "border-transparent"
          }`}
          onPress={() => setActiveTab("event")}
        >
          <Text
            className={`font-medium ${
              activeTab === "event" ? "text-orange-500" : "text-gray-500"
            }`}
          >
            Event
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 items-center py-3 border-b-2 ${
            activeTab === "donation"
              ? "border-orange-500"
              : "border-transparent"
          }`}
          onPress={() => setActiveTab("donation")}
        >
          <Text
            className={`font-medium ${
              activeTab === "donation" ? "text-orange-500" : "text-gray-500"
            }`}
          >
            Donation
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form Content */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "event" ? <EventForm /> : <DonationForm />}
      </ScrollView>
    </View>
  );
}

function ImageUploadCard() {
  return (
    <TouchableOpacity className="mb-6">
      <View className="h-32 w-full rounded-xl border-2 border-dashed border-gray-300 justify-center items-center bg-gray-50">
        <Ionicons name="add" size={32} color="#9ca3af" />
        <Text className="text-gray-500 text-xs mt-2">Upload Image</Text>
      </View>
    </TouchableOpacity>
  );
}

function EventForm() {
  return (
    <View className="pb-10">
      <Text className="text-lg font-semibold text-gray-800 mb-4">
        Event Details
      </Text>

      {/* Image Upload Card */}
      <ImageUploadCard />

      <FormField label="Name" placeholder="Enter event name" />
      <FormField
        label="Description"
        placeholder="Enter event description"
        multiline={true}
      />
      <FormField label="Start Time" placeholder="YYYY-MM-DD HH:MM" />
      <FormField
        label="Duration"
        placeholder="Enter duration (e.g., 2 hours)"
      />
      <FormField
        label="Organizers"
        placeholder="Enter organizer names (comma separated)"
      />

      <TouchableOpacity className="bg-orange-500 py-4 rounded-xl mt-6">
        <Text className="text-white text-center font-semibold text-lg">
          Submit Event
        </Text>
      </TouchableOpacity>

      <View className="mt-4">
        <Text className="text-xs text-gray-500 text-center">
          Event submissions will be reviewed by administrators
        </Text>
      </View>
    </View>
  );
}

function DonationForm() {
  return (
    <View className="pb-10">
      <Text className="text-lg font-semibold text-gray-800 mb-4">
        Donation Details
      </Text>

      {/* Image Upload Card */}
      <ImageUploadCard />

      <FormField
        label="Amount"
        placeholder="Enter donation amount"
        keyboardType="numeric"
      />
      <FormField
        label="Description"
        placeholder="Enter donation description"
        multiline={true}
      />
      <FormField label="Cause" placeholder="Enter donation cause" />
      <FormField label="Open Till" placeholder="YYYY-MM-DD" />

      <TouchableOpacity className="bg-orange-500 py-4 rounded-xl mt-6">
        <Text className="text-white text-center font-semibold text-lg">
          Submit Donation
        </Text>
      </TouchableOpacity>

      <View className="mt-4">
        <Text className="text-xs text-gray-500 text-center">
          Donation requests will be reviewed by administrators
        </Text>
      </View>
    </View>
  );
}

function FormField({
  label,
  placeholder,
  multiline = false,
  keyboardType = "default",
}) {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 mb-2">{label}</Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-3 text-gray-800 bg-gray-50"
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        style={multiline ? { height: 100, textAlignVertical: "top" } : {}}
      />
    </View>
  );
}
