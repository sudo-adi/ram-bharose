import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";

type DirectoryItem = {
  icon: string;
  color: string;
  title: string;
  description: string;
  route: string; // Added route property
};

const DirectorySection = () => {
  const router = useRouter();
  const directoryItems = [
    {
      icon: "newspaper",
      color: "#ff8c37",
      title: "Shubh Chintak",
      description: "Community Magazine",
      route: "/shubh-chintak", // Route to shubh-chintak
    },
    {
      icon: "people",
      color: "#ff8c37",
      title: "Committees",
      description: "Organization teams",
      route: "/committees", // Route to calendar
    },
    {
      icon: "medkit",
      color: "#ff8c37",
      title: "Doctors",
      description: "Healthcare",
      route: "/doctors-directory", // Route to doctors-directory
    },
    {
      icon: "clipboard",
      color: "#ff8c37",
      title: "Applications",
      description: "Community apps",
      route: "/application-form", // Route to application-form
    },
  ];

  // Handle card click to navigate to the respective route
  const handleCardPress = (route: string) => {
    router.push(route);
  };

  return (
    <View className="px-5 mb-6">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-lg font-bold text-gray-800">
          Directory & Members 🏢
        </Text>
        <TouchableOpacity onPress={() => router.push("/explore")}>
          <Text className="text-orange-500 text-sm font-medium">View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20 }}
      >
        {directoryItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 mr-2.5"
            style={{ width: 180 }}
            onPress={() => handleCardPress(item.route)}
          >
            <View className="flex-row items-center mb-1.5">
              <View
                className="p-1.5 rounded-full mr-2"
                style={{ backgroundColor: `${item.color}15` }}
              >
                <Ionicons
                  name={item.icon as any}
                  size={16}
                  color={item.color}
                />
              </View>
              <View>
                <Text className="font-bold text-gray-800 text-xs">
                  {item.title}
                </Text>
                <Text className="text-gray-500 text-[10px]">
                  {item.description}
                </Text>
              </View>
            </View>
            <View className="w-full h-px bg-gray-100 mb-1" />
            <Text className="text-[10px] text-orange-500 font-medium text-right">
              View →
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default DirectorySection;
