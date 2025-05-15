import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Dimensions,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  calculateAge,
  handleCall,
  handleWhatsApp,
  handleEmail,
  getPlaceholderImage,
  handleSMS,
} from "./utils/memberUtils";
import DetailItem from "./components/DetailItem";

const { height } = Dimensions.get("window");

const MemberDetailBottomSheet = ({ visible, onClose, member }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    if (visible && member) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [visible, member]);

  if (!member) return null;

  const fullName = `${member.name || ""} ${member.surname || ""}`.trim();
  const fullAddress = [
    member.residential_address_line1,
    member.residential_address_city,
    member.residential_address_state,
    member.pin_code,
  ]
    .filter(Boolean)
    .join(", ");

  const officeAddress = [
    member.office_address,
    member.office_address_city,
    member.office_address_state,
    member.office_address_pin,
  ]
    .filter(Boolean)
    .join(", ");

  const openGoogleMaps = (address) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address
    )}`;
    Linking.openURL(url);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View
          className="bg-white rounded-t-3xl"
          style={{ maxHeight: height * 0.85 }}
        >
          {/* Drag handle for better UX */}
          <View className="items-center pt-2 pb-4">
            <View className="w-16 h-1 bg-gray-300 rounded-full" />
          </View>

          {loading ? (
            <View className="h-96 justify-center items-center">
              <ActivityIndicator size="large" color="#f97316" />
              <Text className="text-gray-500 mt-4">
                Loading member details...
              </Text>
            </View>
          ) : (
            <>
              <ScrollView className="px-6 pb-20">
                {/* Profile Header */}
                <View className="pb-6 pt-2">
                  <View className="flex-row items-center">
                    <Image
                      source={
                        member.profile_pic
                          ? { uri: member.profile_pic }
                          : getPlaceholderImage(member)
                      }
                      className="w-24 h-24 rounded-full border-4 border-white shadow-md"
                    />
                    <View className="ml-4 flex-1">
                      <Text
                        className="text-xl font-bold text-gray-800"
                        numberOfLines={1}
                      >
                        {fullName}
                      </Text>
                      <Text className="text-gray-500 mt-1" numberOfLines={1}>
                        {member.occupation || "Not specified"}
                      </Text>

                      {/* Quick contact buttons */}
                      <View className="flex-row mt-3 space-x-2 gap-2">
                        {member.mobile_no1 && (
                          <TouchableOpacity
                            onPress={() => handleCall(member.mobile_no1)}
                            className="bg-green-100 p-2 rounded-full"
                          >
                            <Ionicons name="call" size={18} color="#22c55e" />
                          </TouchableOpacity>
                        )}

                        {member.mobile_no1 && (
                          <TouchableOpacity
                            onPress={() => handleWhatsApp(member.mobile_no1)}
                            className="bg-blue-100 p-2 rounded-full"
                          >
                            <Ionicons
                              name="logo-whatsapp"
                              size={18}
                              color="#3b82f6"
                            />
                          </TouchableOpacity>
                        )}

                        {member.mobile_no1 && (
                          <TouchableOpacity
                            onPress={() => handleSMS(member.mobile_no1)}
                            className="bg-purple-100 p-2 rounded-full"
                          >
                            <Ionicons
                              name="chatbox-outline"
                              size={18}
                              color="#8b5cf6"
                            />
                          </TouchableOpacity>
                        )}

                        {member.email && (
                          <TouchableOpacity
                            onPress={() => handleEmail(member.email)}
                            className="bg-red-100 p-2 rounded-full"
                          >
                            <Ionicons name="mail" size={18} color="#ef4444" />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                </View>

                {/* Personal Information */}
                <View className="mb-6">
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="person" size={20} color="#f97316" />
                    <Text className="text-lg font-bold text-gray-800 ml-2">
                      Personal Information
                    </Text>
                  </View>
                  <View className="bg-orange-50 rounded-xl p-4">
                    <DetailItem
                      label="Age"
                      value={calculateAge(member.date_of_birth)}
                      icon="calendar-outline"
                    />
                    <DetailItem
                      label="Gender"
                      value={member.gender}
                      icon="male-female-outline"
                    />
                    <DetailItem
                      label="Blood Group"
                      value={member.blood_group}
                      icon="water-outline"
                    />
                    <DetailItem
                      label="Date of Birth"
                      value={member.date_of_birth}
                      icon="calendar-outline"
                    />
                    <DetailItem
                      label="Marital Status"
                      value={member.marital_status}
                      icon="heart-outline"
                    />
                  </View>
                </View>

                {/* Education & Profession */}
                <View className="mb-6">
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="school" size={20} color="#f97316" />
                    <Text className="text-lg font-bold text-gray-800 ml-2">
                      Education & Profession
                    </Text>
                  </View>
                  <View className="bg-blue-50 rounded-xl p-4">
                    <DetailItem
                      label="Occupation"
                      value={member.occupation}
                      icon="briefcase-outline"
                    />
                    <DetailItem
                      label="Education"
                      value={member.education}
                      icon="school-outline"
                    />
                    <DetailItem
                      label="Company"
                      value={member.college_or_company}
                      icon="business-outline"
                    />
                    <DetailItem
                      label="Designation"
                      value={member.designation}
                      icon="ribbon-outline"
                    />
                  </View>
                </View>

                {/* Contact Information */}
                <View className="mb-6">
                  <View className="flex-row items-center mb-3 gap-2">
                    <Ionicons name="call" size={20} color="#f97316" />
                    <Text className="text-lg font-bold text-gray-800 ml-2">
                      Contact Information
                    </Text>
                  </View>
                  <View className="bg-green-50 rounded-xl p-4">
                    <DetailItem
                      label="Mobile"
                      value={member.mobile_no1}
                      icon="call-outline"
                    />
                    <DetailItem
                      label="Alternate Mobile"
                      value={member.mobile_no2}
                      icon="call-outline"
                    />
                    <DetailItem
                      label="Email"
                      value={member.email}
                      icon="mail-outline"
                    />
                    <DetailItem
                      label="Landline"
                      value={member.landline}
                      icon="call-outline"
                    />
                  </View>
                </View>

                {/* Address Information */}
                <View className="mb-6">
                  <View className="flex-row items-center mb-3 justify-between">
                    <View className="flex-row items-center">
                      <Ionicons name="location" size={20} color="#f97316" />
                      <Text className="text-lg font-bold text-gray-800 ml-2">
                        Address Information
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => openGoogleMaps(fullAddress)}
                      className="bg-blue-100 p-2 rounded-full ml-2 flex flex-row gap-2 px-4"
                    >
                      <Ionicons name="map" size={18} color="#3b82f6" />
                      <Text>View on Map</Text>
                    </TouchableOpacity>
                  </View>
                  <View className="bg-purple-50 rounded-xl p-4">
                    <DetailItem
                      label="Residential Address"
                      value={fullAddress}
                      icon="home-outline"
                    />
                    <DetailItem
                      label="Office Address"
                      value={officeAddress}
                      icon="business-outline"
                    />
                    <DetailItem
                      label="Native Place"
                      value={member.native_place}
                      icon="flag-outline"
                    />
                  </View>
                </View>

                {/* Family Information */}
                <View className="mb-24">
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="people" size={20} color="#f97316" />
                    <Text className="text-lg font-bold text-gray-800 ml-2">
                      Family Information
                    </Text>
                  </View>
                  <View className="bg-yellow-50 rounded-xl p-4">
                    <DetailItem
                      label="Family Number"
                      value={member.family_no}
                      icon="home-outline"
                    />
                    <DetailItem
                      label="Relationship"
                      value={member.relationship}
                      icon="people-outline"
                    />
                    <DetailItem
                      label="Anniversary"
                      value={member.anniversary}
                      icon="calendar-outline"
                    />
                  </View>
                </View>
              </ScrollView>

              {/* Fixed close button at bottom */}
              <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
                <TouchableOpacity
                  className="bg-orange-500 py-3 rounded-xl items-center"
                  onPress={onClose}
                >
                  <Text className="font-medium text-white">Close</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default MemberDetailBottomSheet;
