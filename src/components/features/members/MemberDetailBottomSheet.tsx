import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Linking,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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

  const calculateAge = (dob) => {
    if (!dob) return "Unknown";
    const parts = dob.split("/");
    if (parts.length !== 3) return "Unknown";

    const day = parseInt(parts[0]);
    const monthStr = parts[1];
    const yearStr = parts[2];

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months.indexOf(monthStr);

    if (isNaN(day) || month === -1) return "Unknown";

    let year = parseInt(yearStr);
    if (year < 100) {
      year = year < 50 ? 2000 + year : 1900 + year;
    }

    const birthDate = new Date(year, month, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age.toString();
  };

  const handleCall = (phoneNumber) => {
    if (phoneNumber && phoneNumber !== "Not available") {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleWhatsApp = (phoneNumber) => {
    if (phoneNumber && phoneNumber !== "Not available") {
      const formattedNumber = phoneNumber.replace(/\D/g, "");
      Linking.openURL(`whatsapp://send?phone=${formattedNumber}`);
    }
  };

  const handleEmail = (email) => {
    if (email && email !== "Not available") {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const renderDetailItem = (label, value, icon) => {
    if (!value || value === "Not available" || value === "Unknown") return null;

    return (
      <View className="flex-row items-center mx-2 py-3 border-b border-gray-100">
        <View className="w-10 items-center">
          <Ionicons name={icon} size={20} color="#f97316" />
        </View>
        <View className="flex-1">
          <Text className="text-gray-500 text-xs">{label}</Text>
          <Text className="text-gray-800 font-medium">{value}</Text>
        </View>
      </View>
    );
  };

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
                      source={{
                        uri:
                          member.profile_pic ||
                          "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg",
                      }}
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
                    {renderDetailItem(
                      "Age",
                      calculateAge(member.date_of_birth),
                      "calendar-outline"
                    )}
                    {renderDetailItem(
                      "Gender",
                      member.gender,
                      "male-female-outline"
                    )}
                    {renderDetailItem(
                      "Blood Group",
                      member.blood_group,
                      "water-outline"
                    )}
                    {renderDetailItem(
                      "Date of Birth",
                      member.date_of_birth,
                      "calendar-outline"
                    )}
                    {renderDetailItem(
                      "Marital Status",
                      member.marital_status,
                      "heart-outline"
                    )}
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
                    {renderDetailItem(
                      "Occupation",
                      member.occupation,
                      "briefcase-outline"
                    )}
                    {renderDetailItem(
                      "Education",
                      member.education,
                      "school-outline"
                    )}
                    {renderDetailItem(
                      "Company",
                      member.company_name,
                      "business-outline"
                    )}
                    {renderDetailItem(
                      "Designation",
                      member.designation,
                      "ribbon-outline"
                    )}
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
                    {renderDetailItem(
                      "Mobile",
                      member.mobile_no1,
                      "call-outline"
                    )}
                    {renderDetailItem(
                      "Alternate Mobile",
                      member.mobile_no2,
                      "call-outline"
                    )}
                    {renderDetailItem("Email", member.email, "mail-outline")}
                    {renderDetailItem(
                      "Landline",
                      member.landline,
                      "call-outline"
                    )}
                  </View>
                </View>

                {/* Address Information */}
                <View className="mb-6">
                  <View className="flex-row items-center mb-3">
                    <Ionicons name="location" size={20} color="#f97316" />
                    <Text className="text-lg font-bold text-gray-800 ml-2">
                      Address Information
                    </Text>
                  </View>
                  <View className="bg-purple-50 rounded-xl p-4">
                    {fullAddress &&
                      renderDetailItem(
                        "Residential Address",
                        fullAddress,
                        "home-outline"
                      )}
                    {officeAddress &&
                      renderDetailItem(
                        "Office Address",
                        officeAddress,
                        "business-outline"
                      )}
                    {member.native_place &&
                      renderDetailItem(
                        "Native Place",
                        member.native_place,
                        "flag-outline"
                      )}
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
                    {renderDetailItem(
                      "Family Number",
                      member.family_no,
                      "home-outline"
                    )}
                    {renderDetailItem(
                      "Relationship",
                      member.relationship,
                      "people-outline"
                    )}
                    {renderDetailItem(
                      "Anniversary",
                      member.anniversary,
                      "calendar-outline"
                    )}
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
