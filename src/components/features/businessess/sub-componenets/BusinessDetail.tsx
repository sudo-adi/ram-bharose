import React from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Business } from "./types";
import {
  handleCall,
  handleEmail,
  handleWebsite,
  handleWhatsApp,
} from "./contactUtils";
import ImageCarousel from "./ImageCarousel";

type BusinessDetailProps = {
  business: Business;
  currentImageIndex: number;
  onNextImage: () => void;
  onPrevImage: () => void;
  onClose: () => void;
};

const BusinessDetail = ({
  business,
  currentImageIndex,
  onNextImage,
  onPrevImage,
  onClose,
}: BusinessDetailProps) => {
  return (
    <ScrollView className="px-6 pt-2 pb-4" showsVerticalScrollIndicator={false}>
      {/* Image Carousel */}
      {business.images && business.images.length > 0 && (
        <ImageCarousel
          images={business.images}
          currentIndex={currentImageIndex}
          onNext={onNextImage}
          onPrev={onPrevImage}
        />
      )}

      {/* Business Header with Logo */}
      <View className="items-center mb-6 flex-row justify-center">
        {business.logo && (
          <Image
            source={{ uri: business.logo }}
            className="w-14 h-14 rounded-full border-2 border-orange-100 mr-3"
            resizeMode="cover"
          />
        )}
        <View>
          <Text className="text-xl font-bold text-orange-800">
            {business.name}
          </Text>
          <Text className="text-orange-600 text-base mb-1">
            {business.category}
          </Text>
        </View>
      </View>

      {/* Owner Information */}
      {business.owner && (
        <View className="flex-row items-center bg-orange-50 p-3 rounded-lg mb-6">
          <Image
            source={{ uri: business.owner.image }}
            className="w-12 h-12 rounded-full mr-3"
            resizeMode="cover"
          />
          <View>
            <Text className="text-sm text-gray-500">Owner</Text>
            <Text className="text-base font-medium text-orange-800">
              {business.owner.name}
            </Text>
          </View>
        </View>
      )}

      {/* Contact Actions */}
      <View className="flex-row justify-around mb-6">
        <TouchableOpacity
          className="items-center"
          onPress={() => handleCall(business.contact_phone)}
        >
          <View className="bg-pink-500 w-12 h-12 rounded-full items-center justify-center mb-1">
            <Ionicons name="call" size={20} color="white" />
          </View>
          <Text className="text-xs text-gray-600">Call</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center"
          onPress={() => handleWhatsApp(business.contact_phone)}
        >
          <View className="bg-green-500 w-12 h-12 rounded-full items-center justify-center mb-1">
            <Ionicons name="logo-whatsapp" size={20} color="white" />
          </View>
          <Text className="text-xs text-gray-600">WhatsApp</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center"
          onPress={() => handleEmail(business.contact_email)}
        >
          <View className="bg-pink-600 w-12 h-12 rounded-full items-center justify-center mb-1">
            <Ionicons name="mail" size={20} color="white" />
          </View>
          <Text className="text-xs text-gray-600">Email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center"
          onPress={() => handleWebsite(business.website)}
        >
          <View className="bg-pink-700 w-12 h-12 rounded-full items-center justify-center mb-1">
            <Ionicons name="globe" size={20} color="white" />
          </View>
          <Text className="text-xs text-gray-600">Website</Text>
        </TouchableOpacity>
      </View>

      {/* Business Details */}
      <View className="mb-6">
        <Text className="text-lg font-semibold text-orange-800 mb-4">
          Business Information
        </Text>

        <View className="space-y-4 flex flex-col gap-5">
          <View className="flex-row items-start">
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#ea580c"
              className="mt-0.5 mr-3 w-6"
            />
            <View className="flex-1">
              <Text className="text-orange-600 text-xs mb-1">Description</Text>
              <Text className="text-gray-800 text-sm">
                {business.description}
              </Text>
            </View>
          </View>
          <View className="flex-row items-start">
            <Ionicons
              name="location-outline"
              size={18}
              color="#ea580c"
              className="mt-0.5 mr-3 w-6"
            />
            <View className="flex-1">
              <Text className="text-orange-600 text-xs mb-1">Location</Text>
              <Text className="text-gray-800 text-sm">{business.location}</Text>
            </View>
          </View>
          <View className="flex-row items-start">
            <Ionicons
              name="call-outline"
              size={18}
              color="#ea580c"
              className="mt-0.5 mr-3 w-6"
            />
            <View className="flex-1">
              <Text className="text-orange-600 text-xs mb-1">Phone</Text>
              <Text className="text-gray-800 text-sm">
                {business.contact_phone}
              </Text>
            </View>
          </View>
          <View className="flex-row items-start">
            <Ionicons
              name="mail-outline"
              size={18}
              color="#ea580c"
              className="mt-0.5 mr-3 w-6"
            />
            <View className="flex-1">
              <Text className="text-orange-600 text-xs mb-1">Email</Text>
              <Text className="text-gray-800 text-sm">
                {business.contact_email}
              </Text>
            </View>
          </View>
          <View className="flex-row items-start">
            <Ionicons
              name="globe-outline"
              size={18}
              color="#ea580c"
              className="mt-0.5 mr-3 w-6"
            />
            <View className="flex-1">
              <Text className="text-orange-600 text-xs mb-1">Website</Text>
              <Text className="text-gray-800 text-sm">{business.website}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Close Button - Made more prominent */}
      <TouchableOpacity
        className="bg-orange-600 py-4 rounded-lg mt-4 mb-10"
        onPress={onClose}
      >
        <Text className="text-white font-medium text-center text-base">
          Close
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BusinessDetail;
