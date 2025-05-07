import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  ImageBackground,
  Dimensions,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function ExploreContent() {
  const screenWidth = Dimensions.get("window").width;
  const cardWidth = (screenWidth - 50) / 2; // Account for padding and gap

  // Track loading state for each image
  const [imageLoadStatus, setImageLoadStatus] = useState({});

  const categories = [
    {
      id: 1,
      title: "Donations",
      image: require("../../../../assets/donation.png"),
    },
    {
      id: 2,
      title: "My Family Profile",
      image: require("../../../../assets/family.png"),
    },
    {
      id: 3,
      title: "Birthdays",
      image: require("../../../../assets/birthday.png"),
    },
    {
      id: 4,
      title: "Application Forms",
      image: require("../../../../assets/application.png"),
    },
    {
      id: 5,
      title: "News & Updates",
      image: require("../../../../assets/news.png"),
    },
    {
      id: 6,
      title: "Doctors Directory",
      image: require("../../../../assets/doctor.png"),
    },
    {
      id: 7,
      title: "Shubh Chintak",
      image: require("../../../../assets/shubh-chintak.png"),
    },
    {
      id: 8,
      title: "Committees",
      image: require("../../../../assets/committie.png"),
    },
    {
      id: 9,
      title: "Nari Sahas",
      image: require("../../../../assets/nari-sahas.png"),
    },
  ];

  return (
    <SafeAreaView
      className="flex-1 bg-white"
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      {/* Sticky Search Bar */}
      <View
        className="bg-white z-10 shadow-sm"
        style={{ position: "absolute", top: 0, left: 0, right: 0 }}
      >
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
      </View>

      {/* Content with padding to account for sticky header */}
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ paddingTop: 70 }}
      >
        {/* Categories Grid */}
        <View className="px-5 pb-10">
          <View className="flex-row flex-wrap justify-between">
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                className="mb-4"
                style={{ width: cardWidth }}
                onPress={() => {
                  if (category.title === "Donations") {
                    router.push("/donations");
                  } else if (category.title === "My Family Profile") {
                    router.push("/family-profile");
                  } else if (category.title === "Birthdays") {
                    router.push("/birthdays");
                  } else if (category.title === "Application Forms") {
                    router.push("/application-form");
                  } else if (category.title === "News & Updates") {
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
                <View className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                  <View style={{ height: 220, width: "100%" }}>
                    {/* Loading indicator */}
                    {!imageLoadStatus[category.id] && (
                      <View
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "#f3f4f6",
                        }}
                      >
                        <ActivityIndicator size="large" color="#0000ff" />
                      </View>
                    )}

                    {/* Actual image with error handling */}
                    <ImageBackground
                      source={category.image}
                      className="w-full h-full"
                      resizeMode="cover"
                      onLoad={() =>
                        setImageLoadStatus((prev) => ({
                          ...prev,
                          [category.id]: true,
                        }))
                      }
                      onError={() => {
                        console.warn(
                          `Failed to load image for category: ${category.title}`
                        );
                        setImageLoadStatus((prev) => ({
                          ...prev,
                          [category.id]: true,
                        }));
                      }}
                      defaultSource={require("../../../../assets/news.png")}
                    >
                      <LinearGradient
                        colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]}
                        style={{
                          position: "absolute",
                          left: 0,
                          right: 0,
                          bottom: 0,
                          height: "100%",
                          justifyContent: "flex-end",
                          padding: 12,
                        }}
                      >
                        <Text className="text-white font-bold text-lg">
                          {category.title}
                        </Text>
                      </LinearGradient>
                    </ImageBackground>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
