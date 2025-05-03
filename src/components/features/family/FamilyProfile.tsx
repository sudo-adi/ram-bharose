import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useFamily } from '@/hooks/useSupabase';
import { useUser } from "@clerk/clerk-expo";

export default function FamilyProfileContent() {
  const [activeTab, setActiveTab] = useState("members");
  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const { result: familyData, fetchFamily, error } = useFamily();

  useEffect(() => {
    fetchFamily(email);
  }, []);

  if (error) {
    console.error('Error loading family data:', error);
    return <Text>Error loading family data</Text>;
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Cover Image & Family Info */}
      <View className="h-56 relative">
        <Image
          source={{ uri: familyData.family_cover_pic }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-black/30" />
        <View className="absolute bottom-0 left-0 right-0 p-6">
          <Text className="text-3xl font-bold text-white">
            {familyData.surname}
          </Text>
          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center">
              <Ionicons name="location" size={16} color="white" />
              <Text className="text-white ml-2">{familyData.address}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Family Stats */}
      <View className="px-6 py-4 flex-row justify-between bg-white mx-4 rounded-xl -mt-6 shadow-sm z-10">
        <View className="items-center">
          <Text className="text-2xl font-bold text-orange-500">
            {familyData.familyMembers.length}
          </Text>
          <Text className="text-gray-500">Members</Text>
        </View>
        <View className="items-center">
          <Ionicons name="people" size={24} color="#10b981" />
          <Text className="text-gray-500 mt-1">Family</Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row border-b border-gray-200 mx-4 mt-4">
        <TouchableOpacity
          className={`flex-1 items-center py-3 border-b-2 ${activeTab === "members" ? "border-orange-500" : "border-transparent"
            }`}
          onPress={() => setActiveTab("members")}
        >
          <Text
            className={`font-medium ${activeTab === "members" ? "text-orange-500" : "text-gray-500"
              }`}
          >
            Members
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 items-center py-3 border-b-2 ${activeTab === "tree" ? "border-orange-500" : "border-transparent"
            }`}
          onPress={() => setActiveTab("tree")}
        >
          <Text
            className={`font-medium ${activeTab === "tree" ? "text-orange-500" : "text-gray-500"
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
                  source={{ uri: familyData.head_of_family.profile_pic }}
                  className="w-16 h-16 rounded-xl"
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

            {/* Family Members */}
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              Family Members ({familyData.familyMembers.length})
            </Text>
            {familyData.familyMembers.map((member) => (
              <TouchableOpacity
                key={member.id}
                className="bg-white rounded-xl mb-3 p-4 flex-row items-center shadow-sm"
              >
                <Image
                  source={{ uri: member.profile_pic }}
                  className="w-14 h-14 rounded-xl"
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

              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="w-full mt-6">
                <View className=" items-center px-4">
                  {/* Parents Level */}
                  <View className="flex-row justify-center mb-8 space-x-20">
                    {familyData.familyMembers
                      .filter(member => member.relationship.toLowerCase() === 'father' || member.relationship.toLowerCase() === 'mother')
                      .map((parent) => (
                        <View key={parent.id} className="items-center">
                          <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center">
                            <Image
                              source={{ uri: parent.profile_pic }}
                              className="w-14 h-14 rounded-full"
                            />
                          </View>
                          <Text className="text-sm mt-2 font-medium">{parent.name}</Text>
                          <Text className="text-xs text-gray-500">{parent.relationship}</Text>
                        </View>
                      ))}
                  </View>

                  {/* Head of Family and Spouse Level */}
                  <View className="flex-row justify-center mb-8 space-x-20">
                    <View className="items-center">
                      <View className="w-20 h-20 bg-orange-100 rounded-full items-center justify-center border-2 border-orange-500">
                        <Image
                          source={{ uri: familyData.head_of_family.profile_pic }}
                          className="w-16 h-16 rounded-full"
                        />
                      </View>
                      <Text className="text-base mt-2 font-bold">{familyData.head_of_family.name}</Text>
                      <Text className="text-sm text-orange-500">Head of Family</Text>
                    </View>
                    {familyData.familyMembers
                      .filter(member => member.relationship.toLowerCase() === 'wife' || member.relationship.toLowerCase() === 'husband')
                      .map((spouse) => (
                        <View key={spouse.id} className="items-center">
                          <View className="w-20 h-20 bg-purple-100 rounded-full items-center justify-center border-2 border-purple-500">
                            <Image
                              source={{ uri: spouse.profile_pic }}
                              className="w-16 h-16 rounded-full"
                            />
                          </View>
                          <Text className="text-base mt-2 font-bold">{spouse.name}</Text>
                          <Text className="text-sm text-purple-500">{spouse.relationship}</Text>
                        </View>
                      ))}
                  </View>

                  {/* Children Level */}
                  <View className="flex-row justify-center space-x-12">
                    {familyData.familyMembers
                      .filter(member => member.relationship.toLowerCase() === 'son' || member.relationship.toLowerCase() === 'daughter')
                      .map((child) => (
                        <View key={child.id} className="items-center">
                          <View className="w-14 h-14 bg-green-100 rounded-full items-center justify-center">
                            <Image
                              source={{ uri: child.profile_pic }}
                              className="w-12 h-12 rounded-full"
                            />
                          </View>
                          <Text className="text-sm mt-2 font-medium">{child.name}</Text>
                          <Text className="text-xs text-gray-500">{child.relationship}</Text>
                        </View>
                      ))}
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>
        )
        }
      </ScrollView >
    </View >
  );
}
