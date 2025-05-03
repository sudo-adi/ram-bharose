import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Doctor = {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience_years: number;
  clinic_address: string;
  contact_email: string;
  contact_phone: string;
  available_timings: string;
  created_at: string;
};

export default function DoctorsDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Mock data for doctors based on the new schema
  const doctors: Doctor[] = [
    {
      id: "1",
      name: "Dr. Rajesh Sharma",
      specialization: "Cardiologist",
      qualification: "MD, DM Cardiology",
      experience_years: 15,
      clinic_address: "123 Health Avenue, Mumbai",
      contact_email: "rajesh.sharma@example.com",
      contact_phone: "+91 9876543210",
      available_timings: "Mon-Fri: 9AM-5PM",
      created_at: "2023-01-15T10:30:00Z",
    },
    {
      id: "2",
      name: "Dr. Priya Patel",
      specialization: "Pediatrician",
      qualification: "MBBS, MD Pediatrics",
      experience_years: 10,
      clinic_address: "456 Child Care Lane, Delhi",
      contact_email: "priya.patel@example.com",
      contact_phone: "+91 9876543211",
      available_timings: "Mon-Sat: 10AM-6PM",
      created_at: "2023-02-20T09:15:00Z",
    },
    {
      id: "3",
      name: "Dr. Amit Kumar",
      specialization: "Orthopedic Surgeon",
      qualification: "MS Orthopedics",
      experience_years: 12,
      clinic_address: "789 Bone Health Center, Bangalore",
      contact_email: "amit.kumar@example.com",
      contact_phone: "+91 9876543212",
      available_timings: "Tue-Sun: 11AM-7PM",
      created_at: "2023-03-10T14:45:00Z",
    },
    {
      id: "4",
      name: "Dr. Sneha Reddy",
      specialization: "Dermatologist",
      qualification: "MD Dermatology",
      experience_years: 8,
      clinic_address: "101 Skin Care Plaza, Hyderabad",
      contact_email: "sneha.reddy@example.com",
      contact_phone: "+91 9876543213",
      available_timings: "Mon-Fri: 9AM-4PM",
      created_at: "2023-04-05T11:20:00Z",
    },
    {
      id: "5",
      name: "Dr. Vikram Singh",
      specialization: "Neurologist",
      qualification: "MD, DM Neurology",
      experience_years: 18,
      clinic_address: "202 Brain Health Institute, Chennai",
      contact_email: "vikram.singh@example.com",
      contact_phone: "+91 9876543214",
      available_timings: "Wed-Mon: 10AM-6PM",
      created_at: "2023-05-12T16:30:00Z",
    },
  ];

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDoctorPress = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  // Improved doctor card rendering
  const renderDoctorCard = ({ item }: { item: Doctor }) => (
    <TouchableOpacity
      className="mb-4 bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm mx-4"
      onPress={() => handleDoctorPress(item)}
    >
      <View className="p-4">
        {/* Doctor Header */}
        <View className="flex-row items-center mb-3">
          <View className="w-12 h-12 bg-orange-100 rounded-full items-center justify-center mr-3">
            <Text className="text-orange-500 text-lg font-bold">
              {item.name.charAt(0)}
            </Text>
          </View>
          <View className="flex-1">
            <Text
              className="text-base font-bold text-gray-800"
              numberOfLines={1}
            >
              {item.name}
            </Text>
            <Text className="text-orange-500 font-medium text-sm">
              {item.specialization}
            </Text>
          </View>
        </View>

        {/* Doctor Info */}
        <View className="flex-row items-center my-1">
          <Ionicons name="school-outline" size={14} color="#666" />
          <Text className="text-gray-600 text-xs ml-1 flex-1" numberOfLines={1}>
            {item.qualification}
          </Text>
        </View>

        <View className="flex-row items-center mb-2">
          <Ionicons name="time-outline" size={14} color="#666" />
          <Text className="text-gray-600 text-xs ml-1">
            {item.experience_years} yrs experience
          </Text>
        </View>

        <View className="flex-row items-center mb-3">
          <Ionicons name="location-outline" size={14} color="#666" />
          <Text className="text-gray-600 text-xs ml-1" numberOfLines={1}>
            {item.clinic_address}
          </Text>
        </View>

        {/* Contact Buttons */}
        <View className="flex-row justify-between mt-2">
          <TouchableOpacity
            className="bg-green-500 py-2 px-3 rounded-lg flex-row items-center justify-center flex-1 mr-2"
            onPress={(e) => {
              e.stopPropagation();
              handleCall(item.contact_phone);
            }}
          >
            <Ionicons name="call" size={16} color="white" />
            <Text className="text-white text-xs font-medium ml-1">Call</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-green-600 py-2 px-3 rounded-lg flex-row items-center justify-center flex-1"
            onPress={(e) => {
              e.stopPropagation();
              Linking.openURL(
                `https://wa.me/${item.contact_phone.replace(/[^0-9]/g, "")}`
              );
            }}
          >
            <Ionicons name="logo-whatsapp" size={16} color="white" />
            <Text className="text-white text-xs font-medium ml-1">
              WhatsApp
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-5 py-4">
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3 mb-6">
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-800"
            placeholder="Search by name or specialization..."
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>
        {/* Specialization Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {[
            "All",
            "Cardiologist",
            "Pediatrician",
            "Orthopedic",
            "Dermatologist",
            "Neurologist",
          ].map((category) => (
            <TouchableOpacity
              key={category}
              className={`mr-2 px-4 py-2 rounded-full ${
                category === "All" ? "bg-orange-500" : "bg-gray-100"
              }`}
            >
              <Text
                className={`${
                  category === "All" ? "text-white" : "text-gray-700"
                } font-medium`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Doctor List - Updated to a single column layout */}
      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => item.id}
        renderItem={renderDoctorCard}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <Ionicons name="medical-outline" size={48} color="#d1d5db" />
            <Text className="text-gray-400 mt-4 text-center">
              No doctors found matching your search
            </Text>
          </View>
        }
      />

      {/* Doctor Detail Modal */}
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
          <View className="bg-white rounded-t-3xl w-full max-h-[85%]">
            {/* Drag handle */}
            <View className="py-3 items-center">
              <View className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </View>

            {selectedDoctor && (
              <ScrollView
                className="px-6 pt-2"
                showsVerticalScrollIndicator={false}
              >
                {/* Doctor Header */}
                <View className="items-center mb-6">
                  <View className="w-20 h-20 bg-orange-100 rounded-full items-center justify-center mb-4">
                    <Text className="text-orange-500 text-2xl font-bold">
                      {selectedDoctor.name.charAt(0)}
                    </Text>
                  </View>
                  <Text className="text-xl font-bold text-gray-800">
                    {selectedDoctor.name}
                  </Text>
                  <Text className="text-orange-500 text-base mb-1">
                    {selectedDoctor.specialization}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {selectedDoctor.qualification}
                  </Text>
                </View>

                {/* Contact Actions */}
                <View className="flex-row justify-around mb-6">
                  <TouchableOpacity
                    className="items-center"
                    onPress={() => handleCall(selectedDoctor.contact_phone)}
                  >
                    <View className="bg-green-500 w-12 h-12 rounded-full items-center justify-center mb-1">
                      <Ionicons name="call" size={20} color="white" />
                    </View>
                    <Text className="text-xs text-gray-600">Call</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="items-center"
                    onPress={() => handleEmail(selectedDoctor.contact_email)}
                  >
                    <View className="bg-blue-500 w-12 h-12 rounded-full items-center justify-center mb-1">
                      <Ionicons name="mail" size={20} color="white" />
                    </View>
                    <Text className="text-xs text-gray-600">Email</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="items-center"
                    onPress={() =>
                      Linking.openURL(
                        `https://wa.me/${selectedDoctor.contact_phone.replace(
                          /[^0-9]/g,
                          ""
                        )}`
                      )
                    }
                  >
                    <View className="bg-green-600 w-12 h-12 rounded-full items-center justify-center mb-1">
                      <Ionicons name="logo-whatsapp" size={20} color="white" />
                    </View>
                    <Text className="text-xs text-gray-600">WhatsApp</Text>
                  </TouchableOpacity>
                </View>

                {/* Doctor Details */}
                <View className="mb-6">
                  <Text className="text-lg font-semibold text-gray-800 mb-4">
                    Doctor Information
                  </Text>

                  <View className="space-y-4">
                    <View className="flex-row items-start">
                      <Ionicons
                        name="time-outline"
                        size={18}
                        color="#f97316"
                        className="mt-0.5 mr-3 w-6"
                      />
                      <View className="flex-1">
                        <Text className="text-gray-500 text-xs mb-1">
                          Experience
                        </Text>
                        <Text className="text-gray-800 text-sm">
                          {selectedDoctor.experience_years} years
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-start">
                      <Ionicons
                        name="location-outline"
                        size={18}
                        color="#f97316"
                        className="mt-0.5 mr-3 w-6"
                      />
                      <View className="flex-1">
                        <Text className="text-gray-500 text-xs mb-1">
                          Clinic Address
                        </Text>
                        <Text className="text-gray-800 text-sm">
                          {selectedDoctor.clinic_address}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-start">
                      <Ionicons
                        name="call-outline"
                        size={18}
                        color="#f97316"
                        className="mt-0.5 mr-3 w-6"
                      />
                      <View className="flex-1">
                        <Text className="text-gray-500 text-xs mb-1">
                          Phone
                        </Text>
                        <Text className="text-gray-800 text-sm">
                          {selectedDoctor.contact_phone}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-start">
                      <Ionicons
                        name="mail-outline"
                        size={18}
                        color="#f97316"
                        className="mt-0.5 mr-3 w-6"
                      />
                      <View className="flex-1">
                        <Text className="text-gray-500 text-xs mb-1">
                          Email
                        </Text>
                        <Text className="text-gray-800 text-sm">
                          {selectedDoctor.contact_email}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-start">
                      <Ionicons
                        name="calendar-outline"
                        size={18}
                        color="#f97316"
                        className="mt-0.5 mr-3 w-6"
                      />
                      <View className="flex-1">
                        <Text className="text-gray-500 text-xs mb-1">
                          Available Timings
                        </Text>
                        <Text className="text-gray-800 text-sm">
                          {selectedDoctor.available_timings}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Close Button */}
                <TouchableOpacity
                  className="bg-orange-500 py-3 rounded-lg mt-2 mb-6"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="text-white font-medium text-center">
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
}
