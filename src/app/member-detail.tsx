import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
} from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useProfile } from "@/hooks";

export default function MemberDetailScreen() {
  const params = useLocalSearchParams();
  const memberId = params.memberId;

  const { data: member, loading, error } = useProfile(Number(memberId));

  const calculateAge = (dob) => {
    if (!dob) return "Unknown";

    // Parse date in format DD/MMM/YY
    const parts = dob.split("/");
    if (parts.length !== 3) return "Unknown";

    const day = parseInt(parts[0]);
    const monthStr = parts[1];
    const yearStr = parts[2];

    // Convert month string to number
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

    // Handle 2-digit year format
    let year = parseInt(yearStr);
    if (year < 100) {
      year = year < 50 ? 2000 + year : 1900 + year;
    }

    // Calculate age
    const birthDate = new Date(year, month, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    // Adjust age if birthday hasn't occurred yet this year
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
    if (phoneNumber) {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleWhatsApp = (phoneNumber) => {
    if (phoneNumber) {
      // Remove any non-numeric characters
      const formattedNumber = phoneNumber.replace(/\D/g, "");
      Linking.openURL(`whatsapp://send?phone=${formattedNumber}`);
    }
  };

  const handleEmail = (email) => {
    if (email) {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const renderDetailItem = (label, value, icon) => {
    if (!value) return null;

    return (
      <View className="flex-row items-center py-3 border-b border-gray-100">
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

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (!member) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-6">
        <Ionicons name="alert-circle-outline" size={48} color="#9ca3af" />
        <Text className="text-gray-500 mt-4 text-center">
          Member information not found
        </Text>
        <TouchableOpacity
          className="mt-6 bg-orange-400 px-6 py-3 rounded-lg"
          onPress={() => router.back()}
        >
          <Text className="text-white font-medium">Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

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
    <>
      <Stack.Screen
        options={{
          title: fullName,
          headerTitleStyle: { fontSize: 16 },
        }}
      />
      <ScrollView className="flex-1 bg-white">
        {/* Header with profile image */}
        <View className="bg-orange-50 pt-6 pb-10 items-center">
          <Image
            source={{
              uri:
                member.profile_pic ||
                "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg",
            }}
            className="w-28 h-28 rounded-full border-4 border-white"
          />
          <Text className="text-xl font-bold mt-3 text-gray-800">
            {fullName}
          </Text>
          <Text className="text-gray-500">
            {member.occupation || "Not specified"}
          </Text>

          <View className="flex-row mt-4">
            {member.mobile_no1 && (
              <TouchableOpacity
                className="bg-green-500 rounded-full p-3 mx-2"
                onPress={() => handleCall(member.mobile_no1)}
              >
                <Ionicons name="call" size={20} color="white" />
              </TouchableOpacity>
            )}

            {member.mobile_no1 && (
              <TouchableOpacity
                className="bg-blue-500 rounded-full p-3 mx-2"
                onPress={() => handleWhatsApp(member.mobile_no1)}
              >
                <Ionicons name="logo-whatsapp" size={20} color="white" />
              </TouchableOpacity>
            )}

            {member.email && (
              <TouchableOpacity
                className="bg-red-500 rounded-full p-3 mx-2"
                onPress={() => handleEmail(member.email)}
              >
                <Ionicons name="mail" size={20} color="white" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Personal Information */}
        <View className="p-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Personal Information
          </Text>

          {renderDetailItem(
            "Family Number",
            member.family_no,
            "people-outline"
          )}
          {renderDetailItem("Gender", member.gender, "person-outline")}
          {renderDetailItem(
            "Age",
            member.date_of_birth
              ? `${calculateAge(member.date_of_birth)} years`
              : "Unknown",
            "calendar-outline"
          )}
          {renderDetailItem(
            "Date of Birth",
            member.date_of_birth,
            "calendar-outline"
          )}
          {renderDetailItem("Blood Group", member.blood_group, "water-outline")}
          {renderDetailItem(
            "Marital Status",
            member.marital_status,
            "heart-outline"
          )}
          {renderDetailItem(
            "Marriage Date",
            member.marriage_date,
            "calendar-outline"
          )}
          {renderDetailItem(
            "Relationship",
            member.relationship,
            "people-outline"
          )}
          {renderDetailItem(
            "Father's/Husband's Name",
            member.fathers_or_husbands_name,
            "person-outline"
          )}
          {renderDetailItem(
            "Father-in-law's Name",
            member.father_in_laws_name,
            "person-outline"
          )}
          {renderDetailItem(
            "Native Place",
            member.native_place,
            "location-outline"
          )}
        </View>

        {/* Education & Profession */}
        <View className="p-6 pt-0">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Education & Profession
          </Text>

          {renderDetailItem("Education", member.education, "school-outline")}
          {renderDetailItem("Stream", member.stream, "book-outline")}
          {renderDetailItem(
            "Qualification",
            member.qualification,
            "ribbon-outline"
          )}
          {renderDetailItem(
            "Occupation",
            member.occupation,
            "briefcase-outline"
          )}
        </View>

        {/* Contact Information */}
        <View className="p-6 pt-0">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Contact Information
          </Text>

          {renderDetailItem("Email", member.email, "mail-outline")}
          {renderDetailItem(
            "Mobile Number 1",
            member.mobile_no1,
            "call-outline"
          )}
          {renderDetailItem(
            "Mobile Number 2",
            member.mobile_no2,
            "call-outline"
          )}
          {renderDetailItem(
            "Residential Landline",
            member.residential_landline,
            "call-outline"
          )}
          {renderDetailItem(
            "Office Landline",
            member.landline_office,
            "call-outline"
          )}
        </View>

        {/* Address Information */}
        <View className="p-6 pt-0 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-3">
            Address Information
          </Text>

          {renderDetailItem("Residential Address", fullAddress, "home-outline")}
          {officeAddress &&
            renderDetailItem(
              "Office Address",
              officeAddress,
              "business-outline"
            )}
        </View>
      </ScrollView>
    </>
  );
}
