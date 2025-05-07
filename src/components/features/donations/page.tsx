import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DonationsContent() {
  const [activeTab, setActiveTab] = useState("make");

  const donations = [
    {
      id: 1,
      title: "Education for Rural Children",
      description:
        "Help provide education to underprivileged children in rural areas",
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500",
      target: 150000,
      raised: 82500,
      percentage: 55,
    },
    {
      id: 2,
      title: "Animal Shelter Support",
      description:
        "Support our local animal shelter with food and medical supplies",
      image:
        "https://images.unsplash.com/photo-1504595403659-9088ce801e29?w=500",
      target: 30000,
      raised: 15000,
      percentage: 50,
    },
    {
      id: 3,
      title: "Clean Water Initiative",
      description: "Bring clean drinking water to drought-affected communities",
      image:
        "https://images.unsplash.com/photo-1702237231275-d7c87c1815f7?w=500",
      target: 100000,
      raised: 75000,
      percentage: 75,
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

        {/* Progress Bar */}
        <View className="mt-4">
          <View className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <View
              className="h-full bg-orange-500 rounded-full"
              style={{ width: `${donation.percentage}%` }}
            />
          </View>
          <View className="flex-row justify-between mt-3">
            <View>
              <Text className="text-sm text-gray-500">Raised</Text>
              <Text className="text-lg font-semibold text-orange-500">
                ₹{donation.raised.toLocaleString()}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-sm text-gray-500">Goal</Text>
              <Text className="text-lg font-semibold text-gray-700">
                ₹{donation.target.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          className="bg-orange-500 py-4 rounded-xl mt-4 shadow-sm"
          style={{
            shadowColor: "#f97316",
            shadowOpacity: 0.2,
            shadowRadius: 10,
          }}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Donate Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render payment methods section
  const renderPaymentMethods = () => (
    <View className="mt-2 mb-8 bg-white p-4 rounded-xl border border-gray-100">
      <Text className="text-gray-500 font-medium mb-3">
        Supported Payment Methods
      </Text>
      <View className="flex-row items-center space-x-4">
        <View className="bg-gray-50 p-2 rounded-lg">
          <Image
            source={{ uri: "https://razorpay.com/favicon.png" }}
            className="w-8 h-8"
          />
        </View>
        <View className="bg-gray-50 p-2 rounded-lg">
          <Image
            source={{ uri: "https://bitcoin.org/img/icons/opengraph.png" }}
            className="w-8 h-8"
          />
        </View>
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
            contentContainerStyle={{ paddingBottom: 100 }} // Extra padding for tab bar
          >
            {donations.map(renderDonationCard)}
            {renderPaymentMethods()}
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

  return (
    <View className="flex-1 bg-gray-50">
      {/* Main Content */}
      {renderContent()}

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

        <TouchableOpacity
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
        </TouchableOpacity>
      </View>
    </View>
  );
}
