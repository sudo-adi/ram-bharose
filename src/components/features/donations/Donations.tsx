import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DonationsContent() {
  const [activeTab, setActiveTab] = useState("make");
  const [isAdminMode, setIsAdminMode] = useState(false);

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

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-5 pt-4">
        {/* Tabs */}
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row bg-gray-100 rounded-2xl p-1 flex-1">
            <TouchableOpacity
              onPress={() => setActiveTab("make")}
              className={`flex-1 py-3 rounded-xl ${
                activeTab === "make"
                  ? "bg-white shadow-sm border border-gray-100"
                  : ""
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === "make" ? "text-orange-500" : "text-gray-500"
                }`}
              >
                Make a Donation
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("my")}
              className={`flex-1 py-3 rounded-xl ${
                activeTab === "my"
                  ? "bg-white shadow-sm border border-gray-100"
                  : ""
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === "my" ? "text-orange-500" : "text-gray-500"
                }`}
              >
                My Donations
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Donations List */}
      <ScrollView
        className="px-5 pt-6"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {donations.map((donation) => (
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
        ))}

        {/* Payment Methods */}
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
      </ScrollView>
    </View>
  );
}
