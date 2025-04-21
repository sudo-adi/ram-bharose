import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function FamilyProfileContent() {
  const [activeTab, setActiveTab] = useState("members");

  const familyData = {
    familyName: "Sharma Family",
    since: "Est. 1960",
    totalMembers: 24,
    generations: 4,
    address: "123 Park Avenue, Mumbai",
    coverImage:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200",
    headOfFamily: {
      name: "Rajesh Sharma",
      age: 65,
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
      role: "Head of Family",
      occupation: "Retired Professor",
    },
    members: [
      {
        id: 1,
        name: "Priya Sharma",
        age: 35,
        relation: "Daughter",
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500",
        occupation: "Software Engineer",
      },
      {
        id: 2,
        name: "Amit Sharma",
        age: 38,
        relation: "Son",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500",
        occupation: "Business Owner",
      },
    ],
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Cover Image & Family Info */}
      <View className="h-56 relative">
        <Image
          source={{ uri: familyData.coverImage }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black/30" />
        <View className="absolute bottom-0 left-0 right-0 p-6">
          <Text className="text-3xl font-bold text-white">
            {familyData.familyName}
          </Text>
          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center">
              <Ionicons name="location" size={16} color="white" />
              <Text className="text-white ml-2">{familyData.address}</Text>
            </View>
            <Text className="text-white">{familyData.since}</Text>
          </View>
        </View>
      </View>

      {/* Family Stats */}
      <View className="px-6 py-4 flex-row justify-between bg-white mx-4 rounded-xl -mt-6 shadow-sm z-10">
        <View className="items-center">
          <Text className="text-2xl font-bold text-orange-500">
            {familyData.totalMembers}
          </Text>
          <Text className="text-gray-500">Members</Text>
        </View>
        <View className="items-center">
          <Text className="text-2xl font-bold text-blue-500">
            {familyData.generations}
          </Text>
          <Text className="text-gray-500">Generations</Text>
        </View>
        <View className="items-center">
          <Ionicons name="people" size={24} color="#10b981" />
          <Text className="text-gray-500 mt-1">Family</Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row border-b border-gray-200 mx-4 mt-4">
        <TouchableOpacity
          className={`flex-1 items-center py-3 border-b-2 ${
            activeTab === "members" ? "border-orange-500" : "border-transparent"
          }`}
          onPress={() => setActiveTab("members")}
        >
          <Text
            className={`font-medium ${
              activeTab === "members" ? "text-orange-500" : "text-gray-500"
            }`}
          >
            Members
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 items-center py-3 border-b-2 ${
            activeTab === "tree" ? "border-orange-500" : "border-transparent"
          }`}
          onPress={() => setActiveTab("tree")}
        >
          <Text
            className={`font-medium ${
              activeTab === "tree" ? "text-orange-500" : "text-gray-500"
            }`}
          >
            Family Tree
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content Area */}
      <ScrollView className="flex-1 pt-4" showsVerticalScrollIndicator={false}>
        {activeTab === "members" && (
          <View className="px-4">
            {/* Head of Family */}
            <View className="bg-white rounded-xl p-5 shadow-sm mb-4">
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Head of Family
              </Text>
              <View className="flex-row items-center">
                <Image
                  source={{ uri: familyData.headOfFamily.image }}
                  className="w-16 h-16 rounded-xl"
                />
                <View className="ml-4 flex-1">
                  <Text className="text-xl font-bold text-gray-800">
                    {familyData.headOfFamily.name}
                  </Text>
                  <Text className="text-gray-500 mt-1">
                    {familyData.headOfFamily.occupation}
                  </Text>
                  <View className="flex-row mt-3 space-x-2">
                    <TouchableOpacity className="bg-orange-50 px-3 py-1 rounded-full">
                      <Text className="text-orange-500 text-sm">Contact</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="bg-blue-50 px-3 py-1 rounded-full">
                      <Text className="text-blue-500 text-sm">Profile</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {/* Family Members */}
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Family Members ({familyData.members.length})
            </Text>
            {familyData.members.map((member) => (
              <TouchableOpacity
                key={member.id}
                className="bg-white rounded-xl mb-3 p-4 flex-row items-center shadow-sm"
              >
                <Image
                  source={{ uri: member.image }}
                  className="w-14 h-14 rounded-xl"
                />
                <View className="ml-4 flex-1">
                  <Text className="text-lg font-semibold text-gray-800">
                    {member.name}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-orange-500 text-sm">
                      {member.relation}
                    </Text>
                    <Text className="text-gray-400 mx-2">•</Text>
                    <Text className="text-gray-500 text-sm">
                      {member.occupation}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === "tree" && (
          <View className="px-4">
            <View className="bg-white rounded-xl p-6 items-center shadow-sm">
              <MaterialCommunityIcons
                name="family-tree"
                size={80}
                color="#f97316"
              />
              <Text className="text-2xl font-bold text-gray-800 mt-4">
                Family Tree
              </Text>
              <Text className="text-gray-500 text-center mt-2">
                Visualize your family connections across{" "}
                {familyData.generations} generations
              </Text>

              <View className="w-full mt-6">
                {/* Simple tree visualization */}
                <View className="flex-row justify-center mb-4">
                  <View className="items-center">
                    <View className="w-16 h-16 bg-orange-100 rounded-full items-center justify-center">
                      <Ionicons name="person" size={24} color="#f97316" />
                    </View>
                    <Text className="text-sm mt-2">Rajesh</Text>
                  </View>
                </View>

                <View className="flex-row justify-center mb-4">
                  <View className="items-center mx-8">
                    <View className="w-14 h-14 bg-blue-100 rounded-full items-center justify-center">
                      <Ionicons name="person" size={20} color="#3b82f6" />
                    </View>
                    <Text className="text-xs mt-1">Amit</Text>
                  </View>
                  <View className="items-center mx-8">
                    <View className="w-14 h-14 bg-purple-100 rounded-full items-center justify-center">
                      <Ionicons name="person" size={20} color="#8b5cf6" />
                    </View>
                    <Text className="text-xs mt-1">Priya</Text>
                  </View>
                </View>

                <TouchableOpacity className="mt-6 bg-orange-500 px-6 py-3 rounded-full">
                  <Text className="text-white font-medium">View Full Tree</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View className="bg-white rounded-xl p-5 mt-4 shadow-sm">
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Generations
              </Text>
              <View className="flex-row justify-between">
                {[1, 2, 3, 4].map((gen) => (
                  <View key={gen} className="items-center">
                    <View className="w-12 h-12 bg-gray-100 rounded-full items-center justify-center">
                      <Text className="text-gray-800 font-bold">{gen}</Text>
                    </View>
                    <Text className="text-gray-500 text-xs mt-1">
                      Generation
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
