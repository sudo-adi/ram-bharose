// Updated ShubhChintak Component with console logs
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Linking } from "react-native";
import { useShubhChintak } from "@/hooks";

const ShubhChintak = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: magazines, loading, error, refetch } = useShubhChintak();

  // Log all image URLs when magazines data changes
  useEffect(() => {
    if (magazines && magazines.length > 0) {
      console.log("All magazine data:", magazines);

      magazines.forEach((magazine, index) => {
        console.log(`Magazine #${index + 1}:`);
        console.log(`Title: ${magazine.title}`);
        console.log(
          `Cover Image URL: ${magazine.cover_image_url || "Not available"}`
        );
        console.log(`PDF File URL: ${magazine.file_url || "Not available"}`);
        console.log("------------------------");
      });
    }
  }, [magazines]);

  // Filter magazines based on search query
  const filteredMagazines =
    magazines?.filter((magazine) =>
      magazine.title.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  // Handle opening the magazine PDF
  const handleOpenMagazine = (fileUrl: string) => {
    console.log("Attempting to open PDF:", fileUrl);
    if (fileUrl) {
      Linking.openURL(fileUrl).catch((err) => {
        console.error("Error opening magazine:", err);
        alert("Failed to open magazine. Please try again later.");
      });
    } else {
      console.error("No file URL available for this magazine");
      alert("This magazine is not available at the moment.");
    }
  };

  // Handle refresh
  const handleRefresh = () => {
    console.log("Refreshing magazine data...");
    refetch();
  };

  if (loading && !magazines) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (error) {
    console.error("Error loading magazines:", error);
    return (
      <View className="flex-1 justify-center items-center bg-white p-4">
        <Text className="text-red-500 mb-4">
          Error loading magazines: {error.message}
        </Text>
        <TouchableOpacity
          className="bg-orange-500 px-4 py-2 rounded-lg"
          onPress={handleRefresh}
        >
          <Text className="text-white">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={handleRefresh}
          tintColor="#f97316"
        />
      }
    >
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
          {filteredMagazines.length > 0 ? (
            filteredMagazines.map((magazine) => (
              <TouchableOpacity
                key={magazine.id}
                className="w-[48%] mb-4"
                onPress={() => handleOpenMagazine(magazine.file_url)}
              >
                <View className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                  <Image
                    source={{
                      uri:
                        magazine.cover_image_url ||
                        "https://via.placeholder.com/150",
                    }}
                    className="w-full h-48"
                    resizeMode="cover"
                    defaultSource={{ uri: "https://via.placeholder.com/150" }}
                    onError={(e) =>
                      console.log(
                        "Error loading cover image:",
                        e.nativeEvent.error
                      )
                    }
                  />
                  <View className="p-3">
                    <Text
                      className="text-gray-800 font-bold text-sm mb-1"
                      numberOfLines={1}
                    >
                      {magazine.title}
                    </Text>
                    <TouchableOpacity
                      className="bg-orange-500 py-2 rounded-lg"
                      onPress={() => handleOpenMagazine(magazine.file_url)}
                    >
                      <Text className="text-white text-xs font-medium text-center">
                        Read Now
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <View className="w-full py-8 items-center">
              <Ionicons name="document-outline" size={48} color="#9ca3af" />
              <Text className="text-gray-500 mt-4 text-center">
                {searchQuery
                  ? "No magazines match your search"
                  : "No magazines available"}
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default ShubhChintak;
