import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useBusiness } from "../../../../hooks/useSupabase";
import { useState } from "react";
import React from "react";
import { useRouter } from "expo-router";

type Business = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  created_at: string;
  images?: string[];
  logo?: string;
  rating?: number; // Optional for backward compatibility
};

type BusinessSectionProps = {
  title: string;
  onViewAll?: () => void;
};

const BusinessSection = ({ title, onViewAll }: BusinessSectionProps) => {
  const router = useRouter();
  const { data: businesses, loading, error } = useBusiness();
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Show only the first 4 businesses
  const displayBusinesses = businesses?.slice(0, 4) || [];

  const handleBusinessPress = (business: Business) => {
    setSelectedBusiness(business);
    setCurrentImageIndex(0);
    setModalVisible(true);
  };

  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else {
      // Navigate to the businesses page
      router.push("/businesses");
    }
  };

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleWebsite = (website: string) => {
    // Add https:// if not present
    const url = website.startsWith("http") ? website : `https://${website}`;
    Linking.openURL(url);
  };

  const handleWhatsApp = (phoneNumber: string) => {
    // Remove any non-numeric characters from the phone number
    const formattedNumber = phoneNumber.replace(/\D/g, "");
    Linking.openURL(`whatsapp://send?phone=${formattedNumber}`);
  };

  const nextImage = () => {
    if (selectedBusiness?.images) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === selectedBusiness.images!.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedBusiness?.images) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? selectedBusiness.images!.length - 1 : prevIndex - 1
      );
    }
  };

  if (loading) {
    return (
      <View className="mb-6">
        <Text className="text-lg font-bold text-gray-800 px-5">{title}</Text>
        <Text className="px-5 mt-2 text-gray-500">Loading businesses...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="mb-6">
        <Text className="text-lg font-bold text-gray-800 px-5">{title}</Text>
        <Text className="px-5 mt-2 text-red-500">Error loading businesses</Text>
      </View>
    );
  }

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center px-5 mb-3">
        <Text className="text-lg font-bold text-gray-800">{title}</Text>
        <TouchableOpacity onPress={handleViewAll}>
          <Text className="text-orange-500 text-sm font-medium">View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
      >
        {displayBusinesses.map((business, index) => (
          <TouchableOpacity
            key={business.id || index}
            className="bg-white rounded-xl mr-3 shadow-sm overflow-hidden w-52 border border-gray-100"
            onPress={() => handleBusinessPress(business)}
          >
            <View className="h-24 w-full">
              <Image
                source={{
                  uri:
                    business.images?.[0] ||
                    business.logo ||
                    "https://via.placeholder.com/150",
                }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>

            <View className="p-3">
              <Text className="font-bold text-gray-800 text-xs">
                {business.name}
              </Text>
              <Text className="text-gray-500 text-[10px] mt-0.5">
                {business.category}
              </Text>

              <View className="flex-row items-center mt-1.5">
                <Ionicons name="location-outline" size={12} color="#666" />
                <Text className="text-gray-600 text-[10px] ml-1">
                  {business.location}
                </Text>
              </View>

              <TouchableOpacity
                className="mt-2 bg-pink-50 rounded-lg py-1.5"
                onPress={() => handleBusinessPress(business)}
              >
                <Text className="text-pink-600 font-medium text-[10px] text-center">
                  Visit Business
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Business Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-end bg-black/40"
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View className="bg-white rounded-t-3xl w-full max-h-[120%]">
            {/* Drag handle */}
            <View className="py-3 items-center">
              <View className="w-12 h-1.5 bg-pink-200 rounded-full" />
            </View>

            {selectedBusiness && (
              <ScrollView
                className="px-6 pt-2 pb-4"
                showsVerticalScrollIndicator={false}
              >
                {/* Image Carousel */}
                {selectedBusiness.images &&
                  selectedBusiness.images.length > 0 && (
                    <View className="mb-6 relative">
                      <Image
                        source={{
                          uri: selectedBusiness.images[currentImageIndex],
                        }}
                        className="w-full h-56 rounded-xl"
                        resizeMode="cover"
                      />

                      {/* Image Navigation */}
                      <View className="flex-row justify-between absolute top-1/2 w-full px-2 -mt-5">
                        <TouchableOpacity
                          onPress={prevImage}
                          className="bg-black/30 w-10 h-10 rounded-full items-center justify-center"
                        >
                          <Ionicons
                            name="chevron-back"
                            size={24}
                            color="white"
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={nextImage}
                          className="bg-black/30 w-10 h-10 rounded-full items-center justify-center"
                        >
                          <Ionicons
                            name="chevron-forward"
                            size={24}
                            color="white"
                          />
                        </TouchableOpacity>
                      </View>

                      {/* Image Indicators */}
                      <View className="flex-row justify-center absolute bottom-2 w-full">
                        {selectedBusiness.images.map((_, index) => (
                          <View
                            key={index}
                            className={`w-2 h-2 rounded-full mx-1 ${
                              index === currentImageIndex
                                ? "bg-white"
                                : "bg-white/50"
                            }`}
                          />
                        ))}
                      </View>
                    </View>
                  )}

                {/* Business Header with Logo */}
                <View className="items-center mb-6 flex-row justify-center">
                  {selectedBusiness.logo && (
                    <Image
                      source={{ uri: selectedBusiness.logo }}
                      className="w-14 h-14 rounded-full border-2 border-pink-100 mr-3"
                      resizeMode="cover"
                    />
                  )}
                  <View>
                    <Text className="text-xl font-bold text-pink-800">
                      {selectedBusiness.name}
                    </Text>
                    <Text className="text-pink-600 text-base mb-1">
                      {selectedBusiness.category}
                    </Text>
                  </View>
                </View>

                {/* Contact Actions */}
                <View className="flex-row justify-around mb-6">
                  <TouchableOpacity
                    className="items-center"
                    onPress={() => handleCall(selectedBusiness.contact_phone)}
                  >
                    <View className="bg-pink-500 w-12 h-12 rounded-full items-center justify-center mb-1">
                      <Ionicons name="call" size={20} color="white" />
                    </View>
                    <Text className="text-xs text-gray-600">Call</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="items-center"
                    onPress={() =>
                      handleWhatsApp(selectedBusiness.contact_phone)
                    }
                  >
                    <View className="bg-green-500 w-12 h-12 rounded-full items-center justify-center mb-1">
                      <Ionicons name="logo-whatsapp" size={20} color="white" />
                    </View>
                    <Text className="text-xs text-gray-600">WhatsApp</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="items-center"
                    onPress={() => handleEmail(selectedBusiness.contact_email)}
                  >
                    <View className="bg-pink-600 w-12 h-12 rounded-full items-center justify-center mb-1">
                      <Ionicons name="mail" size={20} color="white" />
                    </View>
                    <Text className="text-xs text-gray-600">Email</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="items-center"
                    onPress={() => handleWebsite(selectedBusiness.website)}
                  >
                    <View className="bg-pink-700 w-12 h-12 rounded-full items-center justify-center mb-1">
                      <Ionicons name="globe" size={20} color="white" />
                    </View>
                    <Text className="text-xs text-gray-600">Website</Text>
                  </TouchableOpacity>
                </View>

                {/* Business Details */}
                <View className="mb-6">
                  <Text className="text-lg font-semibold text-pink-800 mb-4">
                    Business Information
                  </Text>

                  <View className="space-y-4 flex flex-col gap-5">
                    <View className="flex-row items-start">
                      <Ionicons
                        name="information-circle-outline"
                        size={18}
                        color="#be185d"
                        style={{ marginTop: 2, width: 24 }}
                      />
                      <View className="ml-2 flex-1">
                        <Text className="text-pink-600 text-xs mb-1">
                          Description
                        </Text>
                        <Text className="text-gray-800 text-sm">
                          {selectedBusiness.description}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-start">
                      <Ionicons
                        name="location-outline"
                        size={18}
                        color="#be185d"
                        style={{ marginTop: 2, width: 24 }}
                      />
                      <View className="ml-2 flex-1">
                        <Text className="text-pink-600 text-xs mb-1">
                          Location
                        </Text>
                        <Text className="text-gray-800 text-sm">
                          {selectedBusiness.location}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-start">
                      <Ionicons
                        name="call-outline"
                        size={18}
                        color="#be185d"
                        style={{ marginTop: 2, width: 24 }}
                      />
                      <View className="ml-2 flex-1">
                        <Text className="text-pink-600 text-xs mb-1">
                          Phone
                        </Text>
                        <Text className="text-gray-800 text-sm">
                          {selectedBusiness.contact_phone}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-start">
                      <Ionicons
                        name="mail-outline"
                        size={18}
                        color="#be185d"
                        style={{ marginTop: 2, width: 24 }}
                      />
                      <View className="ml-2 flex-1">
                        <Text className="text-pink-600 text-xs mb-1">
                          Email
                        </Text>
                        <Text className="text-gray-800 text-sm">
                          {selectedBusiness.contact_email}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-start">
                      <Ionicons
                        name="globe-outline"
                        size={18}
                        color="#be185d"
                        style={{ marginTop: 2, width: 24 }}
                      />
                      <View className="ml-2 flex-1">
                        <Text className="text-pink-600 text-xs mb-1">
                          Website
                        </Text>
                        <Text className="text-gray-800 text-sm">
                          {selectedBusiness.website}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Close Button - Made more prominent */}
                <TouchableOpacity
                  className="bg-pink-600 py-4 rounded-lg mt-4 mb-10"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="text-white font-medium text-center text-base">
                    Close
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default BusinessSection;
