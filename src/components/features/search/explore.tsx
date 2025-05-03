import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

export default function ExploreContent() {
  const categories = [
    {
      id: 1,
      title: "Total Population",
      subtitle: "Male: 2,059 | Female: 1,968",
      value: "4,027",
      image:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2069",
    },
    {
      id: 2,
      title: "Donations",
      image:
        "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070",
    },
    {
      id: 3,
      title: "My Family Profile",
      image:
        "https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=2070",
    },
    {
      id: 4,
      title: "Birthdays",
      image:
        "https://images.unsplash.com/photo-1558636508-e0db3814bd1d?q=80&w=2070",
    },
    {
      id: 6,
      title: "Application Forms",
      image:
        "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=2070",
    },
    {
      id: 7,
      title: "News & Community",
      image:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=2069",
    },
    {
      id: 8,
      title: "Doctors Directory",
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070",
    },
    {
      id: 9,
      title: "Shubh Chintak",
      image:
        "https://images.unsplash.com/photo-1589386417686-0d34b5903d23?q=80&w=2070",
    },
    {
      id: 10,
      title: "Committees",
      image:
        "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070",
    },
    {
      id: 11,
      title: "Nari Sahas",
      image:
        "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2070",
    },
  ];

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Search Bar */}
      <View className="px-5 py-4">
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            placeholder="Search categories..."
            className="flex-1 ml-2 text-base text-gray-800"
            placeholderTextColor="#666"
          />
        </View>
      </View>

      {/* Categories Grid */}
      <View className="px-5 pb-10">
        {/* Grid Layout */}
        <View className="flex-row flex-wrap justify-between">
          {categories.slice(1).map((category) => (
            <TouchableOpacity
              key={category.id}
              className="w-[48%] mb-4"
              onPress={() => {
                if (category.title === "Donations") {
                  router.push("/donations");
                } else if (category.title === "My Family Profile") {
                  router.push("/family-profile");
                } else if (category.title === "Birthdays") {
                  router.push("/birthdays");
                } else if (category.title === "Application Forms") {
                  router.push("/application-form");
                } else if (category.title === "News & Community") {
                  router.push("/news");
                } else if (category.title === "Doctors Directory") {
                  router.push("/doctors-directory");
                } else if (category.title === "Committees") {
                  router.push("/committees");
                } else if (category.title === "Nari Sahas") {
                  router.push("/businesses");
                } else if (category.title === "Shubh Chintak") {
                  router.push("/shubh-chintak");
                }
              }}
            >
              <View className="bg-white rounded-xl overflow-hidden border border-gray-100">
                <Image
                  source={{ uri: category.image }}
                  className="w-full h-24"
                  resizeMode="cover"
                />
                <View className="p-3">
                  <Text className="text-gray-800 font-medium text-sm">
                    {category.title}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
