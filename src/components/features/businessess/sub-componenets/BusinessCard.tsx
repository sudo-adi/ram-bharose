import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Business } from "./types";
import { handleCall, handleWebsite, handleWhatsApp } from "./contactUtils";

type BusinessCardProps = {
  business: Business;
  onPress: (business: Business) => void;
};

const BusinessCard = ({ business, onPress }: BusinessCardProps) => {
  return (
    <TouchableOpacity
      className="mb-4 bg-white rounded-2xl overflow-hidden shadow-lg flex-1 mx-2"
      style={{ elevation: 3 }}
      onPress={() => onPress(business)}
    >
      {/* Card Header with Image */}
      <View>
        {business.images && business.images.length > 0 && (
          <View className="relative">
            <Image
              source={{ uri: business.images[0] }}
              className="w-full h-40 rounded-t-2xl"
              resizeMode="cover"
            />
            {/* Gradient Overlay */}
            <View
              className="absolute bottom-0 left-0 right-0 h-16 rounded-b-lg"
              style={{
                backgroundColor: "rgba(0,0,0,0.3)",
                // backgroundGradient: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
              }}
            />
            {/* Business Logo */}
            {business.logo && (
              <Image
                source={{ uri: business.logo }}
                className="absolute bottom-4 right-4 w-14 h-14 rounded-full border-2 border-white"
                resizeMode="cover"
              />
            )}
            {/* Category Badge */}
            <View className="absolute top-3 left-3 bg-orange-500 px-3 py-1 rounded-full">
              <Text className="text-white font-medium text-xs">
                {business.category}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Card Content */}
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
          <View className="flex-1 pr-2">
            <Text className="text-xl font-bold text-orange-800">
              {business.name}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="location-outline" size={14} color="#ea580c" />
              <Text className="text-gray-600 text-xs ml-1 flex-1">
                {business.location}
              </Text>
            </View>
          </View>
        </View>

        {/* Owner Info */}
        {business.owner && (
          <View className="flex-row items-center mb-3 bg-orange-50 p-2 rounded-lg">
            <Image
              source={{ uri: business.owner.image }}
              className="w-8 h-8 rounded-full mr-2 border border-orange-200"
              resizeMode="cover"
            />
            <View>
              <Text className="text-gray-500 text-xs">Owner</Text>
              <Text className="text-gray-800 text-sm font-medium">
                {business.owner.name}
              </Text>
            </View>
          </View>
        )}

        <Text
          numberOfLines={2}
          className="text-gray-600 text-sm mb-4 leading-5"
        >
          {business.description}
        </Text>

        {/* Contact Buttons */}
        <View className="flex-row justify-between mt-2">
          <TouchableOpacity
            className="bg-orange-500 py-2 px-3 rounded-xl items-center flex-1 mr-2 flex-row justify-center"
            onPress={(e) => {
              e.stopPropagation();
              handleCall(business.contact_phone);
            }}
          >
            <Ionicons name="call" size={16} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-green-500 py-2 px-3 rounded-xl items-center flex-1 mr-2 flex-row justify-center"
            onPress={(e) => {
              e.stopPropagation();
              handleWhatsApp(business.contact_phone);
            }}
          >
            <Ionicons name="logo-whatsapp" size={16} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-orange-700 py-2 px-3 rounded-xl items-center flex-1 flex-row justify-center"
            onPress={(e) => {
              e.stopPropagation();
              handleWebsite(business.website);
            }}
          >
            <Ionicons name="globe-outline" size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BusinessCard;
