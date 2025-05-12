import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  Alert,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { height, width } = Dimensions.get("window");

export default function DonationsContent() {
  const [activeTab, setActiveTab] = useState("make");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState("");

  const donations = [
    {
      id: 1,
      title: "Education for Rural Children",
      description:
        "Help provide education to underprivileged children in rural areas",
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500",
      additionalInfo:
        "This initiative focuses on providing basic education facilities.",
      organization: "Global Learning Foundation",
      impact: "Support 500 children's education",
      donationOptions: [
        {
          amount: "₹10",
          description: "Provides school supplies for one child",
        },
        { amount: "₹25", description: "Covers monthly learning materials" },
        { amount: "₹50", description: "Supports full scholarship for a month" },
      ],
    },
    {
      id: 2,
      title: "Animal Shelter Support",
      description:
        "Support our local animal shelter with food and medical supplies",
      image:
        "https://images.unsplash.com/photo-1504595403659-9088ce801e29?w=500",
      additionalInfo: "Your donation helps feed and care for rescued animals.",
      organization: "Paws & Claws Rescue",
      impact: "Care for 100 rescued animals",
      donationOptions: [
        { amount: "₹15", description: "Feeds 10 animals for a week" },
        { amount: "₹30", description: "Provides medical treatment" },
        { amount: "₹75", description: "Sponsors animal care for a month" },
      ],
    },
    {
      id: 3,
      title: "Clean Water Initiative",
      description: "Bring clean drinking water to drought-affected communities",
      image:
        "https://images.unsplash.com/photo-1702237231275-d7c87c1815f7?w=500",
      additionalInfo:
        "This project aims to install water purification systems.",
      organization: "WaterHope International",
      impact: "Provide water to 5,000 people",
      donationOptions: [
        { amount: "₹20", description: "Provides water for 10 people" },
        { amount: "₹50", description: "Supplies water filters" },
        { amount: "₹100", description: "Supports community water project" },
      ],
    },
    {
      id: 4,
      title: "Healthcare for All",
      description: "Provide essential healthcare services to remote areas",
      image:
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=500",
      additionalInfo: "Your support funds mobile clinics and medical camps.",
      organization: "Global Health Outreach",
      impact: "Medical aid for 2,000 individuals",
      donationOptions: [
        { amount: "₹25", description: "Provides basic medical supplies" },
        { amount: "₹60", description: "Covers medical consultation" },
        { amount: "₹150", description: "Supports full medical camp" },
      ],
    },
    {
      id: 5,
      title: "Tree Plantation Drive",
      description: "Plant trees to combat climate change and deforestation",
      image:
        "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=500",
      additionalInfo: "Join us in planting a million trees this year.",
      organization: "Green Earth Initiative",
      impact: "Plant 10,000 trees",
      donationOptions: [
        { amount: "₹5", description: "Plants 2 trees" },
        { amount: "₹25", description: "Plants 10 trees" },
        { amount: "₹50", description: "Plants 25 trees" },
      ],
    },
  ];

  // Render donation card
  const renderDonationCard = (donation) => (
    <View
      key={donation.id}
      className="mb-6 bg-white rounded-2xl shadow-sm border border-gray-100"
    >
      <Image
        source={{ uri: donation.image }}
        className="w-full h-48 rounded-t-2xl"
      />
      <View className="p-4">
        <Text className="text-xl font-semibold text-gray-800">
          {donation.title}
        </Text>
        <Text className="text-gray-600 mt-1 leading-5">
          {donation.description}
        </Text>

        <TouchableOpacity
          className="bg-orange-500 py-4 rounded-xl mt-4 shadow-sm"
          style={{
            shadowColor: "#f97316",
            shadowOpacity: 0.2,
            shadowRadius: 10,
          }}
          onPress={() => {
            setSelectedDonation(donation);
            setModalVisible(true);
          }}
        >
          <Text className="text-white text-center font-semibold text-lg">
            View Details
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "make":
        return (
          <ScrollView
            className="px-5 pt-6 flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {donations.map(renderDonationCard)}
          </ScrollView>
        );
      case "my":
        return (
          <View className="flex-1 items-center justify-center">
            <Ionicons name="wallet-outline" size={64} color="#f97316" />
            <Text className="text-gray-600 mt-4 text-center px-10">
              You haven't made any donations yet. Start supporting causes you
              care about!
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  // Render donation options
  const renderDonationOptions = (options) => (
    <View className="mt-4">
      <Text className="text-gray-700 font-semibold mb-2">
        Donation Options:
      </Text>
      {options.map((option, index) => (
        <View
          key={index}
          className="flex-row justify-between items-center bg-gray-100 p-3 rounded-lg mb-2"
        >
          <View className="flex-1 pr-2">
            <Text className="text-gray-800 font-medium">{option.amount}</Text>
            <Text className="text-gray-600 text-sm">{option.description}</Text>
          </View>
          <TouchableOpacity
            className="bg-orange-500 px-4 py-2 rounded-lg"
            onPress={() => {
              setSelectedAmount(option.amount);
              setQrModalVisible(true);
            }}
          >
            <Text className="text-white font-semibold">Donate</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Main Content */}
      {renderContent()}

      {/* Modal for Donation Details */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          {selectedDonation && (
            <View
              className="bg-white rounded-t-3xl w-full"
              style={{ height: height * 0.85 }}
            >
              {/* Drag handle for better UX */}
              <View className="items-center pt-2 pb-2">
                <View className="w-16 h-1 bg-gray-300 rounded-full" />
              </View>

              <ScrollView className="px-4 pb-20">
                <Image
                  source={{ uri: selectedDonation.image }}
                  className="w-full h-48 rounded-t-xl"
                />
                <View className="p-4">
                  <Text className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedDonation.title}
                  </Text>
                  <View className="bg-gray-100 p-3 rounded-lg mb-3">
                    <Text className="text-gray-700 font-semibold">
                      {selectedDonation.organization}
                    </Text>
                    <Text className="text-gray-600 text-sm">
                      {selectedDonation.impact}
                    </Text>
                  </View>
                  <Text className="text-gray-600 mb-3">
                    {selectedDonation.description}
                  </Text>
                  <Text className="text-gray-500 mb-3">
                    {selectedDonation.additionalInfo}
                  </Text>

                  {renderDonationOptions(selectedDonation.donationOptions)}
                </View>
              </ScrollView>

              {/* Fixed close button at bottom */}
              <View className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100">
                <TouchableOpacity
                  className="bg-orange-500 py-3 rounded-xl items-center"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="font-medium text-white">Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>

      {/* QR Code Modal */}
      <Modal
        visible={qrModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setQrModalVisible(false)}
      >
        <View className="flex-1 bg-black/70 justify-center items-center">
          <View className="bg-white rounded-3xl w-5/6 p-6 items-center">
            <Text className="text-2xl font-bold text-gray-800 mb-2 text-center">
              Donation QR Code
            </Text>
            <Text className="text-gray-600 mb-6 text-center">
              {selectedDonation && (
                <>
                  Donate {selectedAmount} to {selectedDonation.title}
                </>
              )}
            </Text>

            <Image
              source={require("../../../../assets/qr.png")}
              className="w-64 h-64 mb-6"
              resizeMode="contain"
            />

            <Text className="text-gray-600 mb-6 text-center">
              Scan this QR code with your UPI app to complete your donation
            </Text>

            <TouchableOpacity
              className="bg-orange-500 py-4 px-8 rounded-xl w-full"
              onPress={() => setQrModalVisible(false)}
            >
              <Text className="text-white text-center font-semibold text-lg">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Tab Bar */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex-row justify-around items-center h-16 px-2">
        <TouchableOpacity
          className={`flex-1 items-center justify-center h-full ${
            activeTab === "make" ? "border-t-2 border-orange-500" : ""
          }`}
          onPress={() => setActiveTab("make")}
        >
          <Ionicons
            name="heart"
            size={24}
            color={activeTab === "make" ? "#f97316" : "#9ca3af"}
          />
          <Text
            className={`text-xs mt-1 ${
              activeTab === "make"
                ? "text-orange-500 font-medium"
                : "text-gray-500"
            }`}
          >
            Donate
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          className={`flex-1 items-center justify-center h-full ${
            activeTab === "my" ? "border-t-2 border-orange-500" : ""
          }`}
          onPress={() => setActiveTab("my")}
        >
          <Ionicons
            name="wallet"
            size={24}
            color={activeTab === "my" ? "#f97316" : "#9ca3af"}
          />
          <Text
            className={`text-xs mt-1 ${
              activeTab === "my"
                ? "text-orange-500 font-medium"
                : "text-gray-500"
            }`}
          >
            My Donations
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}
