import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFamily } from "@/hooks";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";

// Fallback cover image URI
const FALLBACK_COVER_IMAGE =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";

// Function to get the appropriate placeholder image based on age and gender
const getPlaceholderImage = (member) => {
  const age = parseInt(member?.age);
  const gender = member?.gender?.toLowerCase() || "";

  if (isNaN(age)) {
    // Default fallback if age cannot be determined
    return require("../../../../assets/icon.png");
  }

  if (gender === "male") {
    if (age < 18) {
      return require("../../../../assets/boy.png");
    } else {
      return require("../../../../assets/man.png");
    }
  } else if (gender === "female") {
    if (age < 18) {
      return require("../../../../assets/girl.png");
    } else {
      return require("../../../../assets/women.png");
    }
  } else {
    // Default fallback if gender is not specified
    return require("../../../../assets/icon.png");
  }
};

// ProfileImage component with placeholder support
const ProfileImage = ({
  uri,
  className,
  member,
}: {
  uri: string;
  className: string;
  member?: any;
}) => {
  if (uri) {
    return <Image source={{ uri }} className={className} />;
  }
  return <Image source={getPlaceholderImage(member)} className={className} />;
};

export default function FamilyProfileContent() {
  const [activeTab, setActiveTab] = useState("members");
  const { result: familyData, fetchFamily, error } = useFamily();

  useEffect(() => {
    const loadFamilyData = async () => {
      try {
        const userPhone = await AsyncStorage.getItem("userPhone");
        if (userPhone) {
          fetchFamily(userPhone);
        }
      } catch (error) {
        console.error("Error loading family data:", error);
      }
    };

    loadFamilyData();
  }, []);

  if (error) {
    console.error("Error loading family data:", error);
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-red-500 text-lg">Error loading family data</Text>
        <Text className="text-gray-500 mt-2">Please try again later</Text>
      </View>
    );
  }
  return (
    <View className="flex-1 bg-gray-50 text-black">
      {/* Cover Image & Family Info */}
      <View className="bg-gray-50 text-black">
        {/* Cover Image & Family Info */}
        <View className="h-48 relative">
          {/* Cover Image */}
          <Image
            source={{
              uri: familyData.family_cover_pic || FALLBACK_COVER_IMAGE,
            }}
            className="w-full h-full"
            resizeMode="cover"
          />

          {/* LinearGradient overlay - same style as reference */}
          <LinearGradient
            colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.7)"]}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              justifyContent: "flex-end",
              padding: 12,
            }}
          >
            {/* Family Info Text - positioned within the gradient */}
            <View className="p-6">
              <Text className="text-gray-100 font-bold text-xl">
                {familyData.surname || "Family"}
              </Text>
              <View className="flex-row items-center justify-between mt-2">
                <View className="flex-row items-start">
                  <Ionicons
                    name="location"
                    size={16}
                    color="white"
                    className="pt-1"
                  />
                  <Text className="text-gray-100 ml-2 font-medium">
                    {familyData.address || "Address not available"}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>
      </View>

      {/* Family Stats */}
      <View className="px-6 py-4 flex-row justify-between bg-white mx-4 rounded-xl -mt-6 shadow-sm z-10">
        <View className="items-center">
          <Text className="text-2xl font-bold text-orange-500">
            {familyData.familyMembers?.length || 0}
          </Text>
          <Text className="text-gray-500">Members</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-green-500">
            {familyData.family_no || "N/A"}
          </Text>
          <Text className="text-gray-500">Family No.</Text>
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
            {familyData.head_of_family && (
              <View className="bg-white rounded-xl p-5 shadow-sm mb-4">
                <Text className="text-lg font-semibold text-gray-800 mb-3">
                  Head of Family
                </Text>
                <View className="flex-row items-center">
                  <ProfileImage
                    uri={familyData.head_of_family.profile_pic}
                    className="w-16 h-16 rounded-xl"
                    member={familyData.head_of_family}
                  />
                  <View className="ml-4 flex-1">
                    <Text className="text-xl font-bold text-gray-800">
                      {familyData.head_of_family.name}
                    </Text>
                    <Text className="text-gray-500 mt-1">
                      {familyData.head_of_family.occupation}
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
            )}

            {/* Family Members */}
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Family Members ({familyData.familyMembers?.length || 0})
            </Text>
            {familyData.familyMembers?.map((member) => (
              <TouchableOpacity
                key={member.id}
                className="bg-white rounded-xl mb-3 p-4 flex-row items-center shadow-sm"
              >
                <ProfileImage
                  uri={member.profile_pic}
                  className="w-14 h-14 rounded-xl"
                  member={member}
                />
                <View className="ml-4 flex-1">
                  <Text className="text-lg font-semibold text-gray-800">
                    {member.name}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Text className="text-orange-500 text-sm">
                      {member.relationship}
                    </Text>
                    <Text className="text-gray-400 mx-2">•</Text>
                    <Text className="text-gray-500 text-sm">
                      {member.occupation}
                    </Text>
                  </View>
                  {member.mobile_no1 && (
                    <Text className="text-gray-400 text-xs mt-1">
                      {member.mobile_no1}
                    </Text>
                  )}
                </View>
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

              {/* Wrapper for horizontal scrolling */}
              <View className="w-full mt-6">
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{
                    flexGrow: 1,
                    justifyContent: "center",
                    paddingHorizontal: 20,
                  }}
                >
                  <View className="items-center" style={{ minWidth: "100%" }}>
                    {/* Parents Level */}
                    <View className="flex-row justify-center mb-8 space-x-20">
                      {familyData.familyMembers
                        ?.filter(
                          (member) =>
                            member.relationship
                              ?.toLowerCase()
                              .includes("father") ||
                            member.relationship
                              ?.toLowerCase()
                              .includes("mother")
                        )
                        .map((parent) => (
                          <View key={parent.id} className="items-center">
                            <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center">
                              <ProfileImage
                                uri={parent.profile_pic}
                                className="w-14 h-14 rounded-full"
                                member={parent}
                              />
                            </View>
                            <Text className="text-sm mt-2 font-medium text-center">
                              {parent.name}
                            </Text>
                            <Text className="text-xs text-gray-500">
                              {parent.relationship}
                            </Text>
                          </View>
                        ))}
                    </View>

                    {/* Head of Family and Spouse Level */}
                    <View className="flex-row justify-center mb-8 space-x-20">
                      {familyData.head_of_family && (
                        <View className="items-center">
                          <View className="w-20 h-20 bg-orange-100 rounded-full items-center justify-center border-2 border-orange-500">
                            <ProfileImage
                              uri={familyData.head_of_family.profile_pic}
                              className="w-16 h-16 rounded-full"
                              member={familyData.head_of_family}
                            />
                          </View>
                          <Text className="text-base mt-2 font-bold text-center">
                            {familyData.head_of_family.name}
                          </Text>
                          <Text className="text-sm text-orange-500">
                            Head of Family
                          </Text>
                        </View>
                      )}
                      {familyData.familyMembers
                        ?.filter(
                          (member) =>
                            member.relationship
                              ?.toLowerCase()
                              .includes("wife") ||
                            member.relationship
                              ?.toLowerCase()
                              .includes("husband") ||
                            member.relationship
                              ?.toLowerCase()
                              .includes("spouse")
                        )
                        .map((spouse) => (
                          <View key={spouse.id} className="items-center">
                            <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center border-2 border-purple-500">
                              <ProfileImage
                                uri={spouse.profile_pic}
                                className="w-16 h-16 rounded-full"
                                member={spouse}
                              />
                            </View>
                            <Text className="text-base mt-2 font-bold text-center">
                              {spouse.name}
                            </Text>
                            <Text className="text-sm text-purple-500">
                              {spouse.relationship}
                            </Text>
                          </View>
                        ))}
                    </View>

                    {/* Children Level */}
                    <View className="flex-row justify-center space-x-12">
                      {familyData.familyMembers
                        ?.filter(
                          (member) =>
                            member.relationship
                              ?.toLowerCase()
                              .includes("son") ||
                            member.relationship
                              ?.toLowerCase()
                              .includes("daughter") ||
                            member.relationship?.toLowerCase().includes("child")
                        )
                        .map((child) => (
                          <View key={child.id} className="items-center">
                            <View className="w-14 h-14 bg-green-100 rounded-full items-center justify-center">
                              <ProfileImage
                                uri={child.profile_pic}
                                className="w-12 h-12 rounded-full"
                                member={child}
                              />
                            </View>
                            <Text className="text-sm mt-2 font-medium text-center">
                              {child.name}
                            </Text>
                            <Text className="text-xs text-gray-500">
                              {child.relationship}
                            </Text>
                          </View>
                        ))}
                    </View>
                  </View>
                </ScrollView>
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
