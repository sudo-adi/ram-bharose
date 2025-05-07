import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  handleCall,
  handleWhatsApp,
  handleEmail,
  getPlaceholderImage,
} from "../utils/memberUtils";

type MemberCardProps = {
  member: any;
  viewType: "grid" | "list";
  onPress: (member: any) => void;
};

const MemberCard = ({ member, viewType, onPress }: MemberCardProps) => {
  return (
    <TouchableOpacity
      key={`member-${member.id}`}
      className={`bg-white rounded-2xl mb-4 overflow-hidden ${
        viewType === "grid" ? "w-[48%]" : "w-full"
      }`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
      onPress={() => onPress(member)}
      activeOpacity={0.7}
    >
      <View className="p-4">
        {viewType === "list" ? (
          // List view
          <View className="flex-row items-center">
            <View className="relative">
              <Image
                source={
                  member.displayImage
                    ? { uri: member.displayImage }
                    : getPlaceholderImage(member)
                }
                className="w-16 h-16 rounded-xl"
              />
              <View className="absolute bottom-0 right-0 bg-orange-500 rounded-full p-1">
                <Ionicons name="person" size={12} color="#ffffff" />
              </View>
            </View>

            <View className="flex-1 ml-4">
              <View className="flex-row justify-between items-start">
                <View className="flex-1 pr-2">
                  <Text className="font-bold text-gray-900 text-base">
                    {member.displayName}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Ionicons
                      name="location-outline"
                      size={12}
                      color="#6b7280"
                    />
                    <Text className="text-gray-500 text-xs ml-1">
                      {member.location}
                    </Text>
                  </View>
                  <View className="flex-row items-center mt-1">
                    <Ionicons
                      name="briefcase-outline"
                      size={12}
                      color="#6b7280"
                    />
                    <Text className="text-gray-500 text-xs ml-1">
                      {member.profession}
                    </Text>
                  </View>
                </View>

                <View className="flex-row">
                  {member.phone && member.phone !== "Not available" && (
                    <>
                      <TouchableOpacity
                        className="bg-green-100 p-2 rounded-full mr-2"
                        onPress={() => handleCall(member.phone)}
                      >
                        <Ionicons
                          name="call-outline"
                          size={16}
                          color="#3b82f6"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="bg-blue-100 p-2 rounded-full mr-2"
                        onPress={() => handleWhatsApp(member.phone)}
                      >
                        <Ionicons
                          name="logo-whatsapp"
                          size={16}
                          color="#10b981"
                        />
                      </TouchableOpacity>
                    </>
                  )}
                  {member.email && member.email !== "Not available" && (
                    <TouchableOpacity
                      className="bg-red-100 p-2 rounded-full"
                      onPress={() => handleEmail(member.email)}
                    >
                      <Ionicons name="mail-outline" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View className="flex-row mt-3 space-x-2">
                <View className="bg-blue-50 px-3 py-1 rounded-full flex-row items-center">
                  <Ionicons name="calendar-outline" size={12} color="#3b82f6" />
                  <Text className="text-xs text-blue-800 ml-1 font-medium">
                    {member.age} years
                  </Text>
                </View>
                <View className="bg-purple-50 px-3 py-1 rounded-full flex-row items-center">
                  {member.gender === "Male" ? (
                    <Ionicons name="man-outline" size={12} color="#8b5cf6" />
                  ) : (
                    <Ionicons name="woman-outline" size={12} color="#8b5cf6" />
                  )}
                  <Text className="text-xs text-purple-800 ml-1 font-medium">
                    {member.gender}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          // Grid view
          <View className="flex-col items-center">
            <Image
              source={
                member.displayImage
                  ? { uri: member.displayImage }
                  : getPlaceholderImage(member)
              }
              className="w-20 h-20 mb-3 rounded-full"
            />

            <View className="items-center mt-2">
              <Text className="font-semibold text-gray-900 text-center">
                {member.displayName}
              </Text>
              <Text className="text-gray-500 text-sm text-center mt-1">
                {member.location}
              </Text>
              <Text className="text-gray-500 text-xs text-center mt-1">
                {member.profession}
              </Text>
            </View>

            <View className="flex-row justify-center mt-2 space-x-2 gap-2">
              <Text className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {member.age} years
              </Text>
              <Text className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                {member.gender}
              </Text>
            </View>

            <View className="flex-row justify-center mt-3">
              {member.phone && member.phone !== "Not available" && (
                <>
                  <TouchableOpacity
                    className="bg-green-100 p-2 rounded-full mr-2"
                    onPress={() => handleCall(member.phone)}
                  >
                    <Ionicons name="call-outline" size={16} color="#3b82f6" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-blue-100 p-2 rounded-full mr-2"
                    onPress={() => handleWhatsApp(member.phone)}
                  >
                    <Ionicons name="logo-whatsapp" size={16} color="#10b981" />
                  </TouchableOpacity>
                </>
              )}
              {member.email && member.email !== "Not available" && (
                <TouchableOpacity
                  className="bg-red-100 p-2 rounded-full"
                  onPress={() => handleEmail(member.email)}
                >
                  <Ionicons name="mail-outline" size={16} color="#ef4444" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default MemberCard;
