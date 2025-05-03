import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const ShubhChintak = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock data for magazines
  const magazines = [
    {
      id: 1,
      title: "Samaj Darshan",
      issue: "January 2024",
      coverImage:
        "https://images.unsplash.com/photo-1603706585928-6ae28d54e4a9?q=80&w=2070",
      description: "Monthly magazine featuring community news and events",
    },
    {
      id: 2,
      title: "Youth Connect",
      issue: "December 2023",
      coverImage:
        "https://images.unsplash.com/photo-1576504677634-06b2130bd1f3?q=80&w=2070",
      description: "Magazine focused on youth activities and achievements",
    },
    {
      id: 3,
      title: "Cultural Heritage",
      issue: "November 2023",
      coverImage:
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=2070",
      description: "Exploring our rich cultural traditions and heritage",
    },
    {
      id: 4,
      title: "Business Insights",
      issue: "October 2023",
      coverImage:
        "https://images.unsplash.com/photo-1554774853-719586f82d77?q=80&w=2070",
      description: "Business news and success stories from our community",
    },
    {
      id: 5,
      title: "Health & Wellness",
      issue: "September 2023",
      coverImage:
        "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?q=80&w=2070",
      description: "Tips and articles on health, wellness, and lifestyle",
    },
    {
      id: 6,
      title: "Education Special",
      issue: "August 2023",
      coverImage:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2070",
      description:
        "Focus on education, scholarships, and academic achievements",
    },
  ];

  // Filter magazines based on search query
  const filteredMagazines = magazines.filter((magazine) =>
    magazine.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Header */}
      <View className="px-5 py-4">
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-6">
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            placeholder="Search magazines..."
            className="flex-1 ml-2 text-base text-gray-800"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {/* Magazines Grid */}
        <View className="flex-row flex-wrap justify-between">
          {filteredMagazines.map((magazine) => (
            <TouchableOpacity
              key={magazine.id}
              className="w-[48%] mb-4"
              onPress={() => {
                // Navigate to magazine detail page (to be implemented)
                console.log(`Opening magazine: ${magazine.title}`);
              }}
            >
              <View className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                <Image
                  source={{ uri: magazine.coverImage }}
                  className="w-full h-48"
                  resizeMode="cover"
                />
                <View className="p-3">
                  <Text className="text-gray-800 font-bold text-sm mb-1">
                    {magazine.title}
                  </Text>
                  <Text className="text-gray-500 text-xs mb-2">
                    {magazine.issue}
                  </Text>
                  <TouchableOpacity
                    className="bg-orange-500 py-2 rounded-lg"
                    onPress={() => {
                      // Navigate to magazine detail page
                      console.log(`Reading magazine: ${magazine.title}`);
                    }}
                  >
                    <Text className="text-white text-xs font-medium text-center">
                      Read Now
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default ShubhChintak;
