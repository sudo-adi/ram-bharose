import { Linking } from "react-native";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";

export default function BirthdaysContent() {
  const [activeTab, setActiveTab] = useState<"today" | "month" | "all">(
    "today"
  );
  const [birthdays, setBirthdays] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBirthdays();
  }, [activeTab]);

  const fetchBirthdays = async () => {
    try {
      setLoading(true);

      // Get current date components
      const now = new Date();
      const currentMonth = now.getMonth(); // 0-indexed (0=Jan, 1=Feb, etc.)
      const currentDay = now.getDate();

      // Month abbreviations
      const monthAbbreviations = [
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
      const currentMonthAbbr = monthAbbreviations[currentMonth];

      // First fetch all birthdays (we'll filter in JavaScript for more complex date handling)
      let query = supabase
        .from("profiles")
        .select("name, surname, date_of_birth, profile_pic, mobile_no1, email")
        .not("date_of_birth", "is", null);

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching birthdays:", error);
        return;
      }

      // Transform and filter the data
      const transformedData = data
        .map((profile) => {
          if (!profile.date_of_birth) return null;

          // Parse date in format "22/Nov/51"
          const dobParts = profile.date_of_birth.split("/");
          if (dobParts.length !== 3) return null;

          const day = parseInt(dobParts[0]);
          const monthAbbr = dobParts[1];
          const yearPart = dobParts[2];

          // Find month index (0-11)
          const monthIndex = monthAbbreviations.findIndex(
            (m) => m.toLowerCase() === monthAbbr.toLowerCase()
          );
          if (monthIndex === -1) return null;

          // Handle 2-digit year (assuming 51 = 1951, 05 = 2005)
          let fullYear;
          if (yearPart.length === 2) {
            const yearNum = parseInt(yearPart);
            fullYear = yearNum < 50 ? 2000 + yearNum : 1900 + yearNum;
          } else {
            fullYear = parseInt(yearPart);
          }

          // Create birth date (using monthIndex)
          const birthDate = new Date(fullYear, monthIndex, day);

          // Calculate age
          const today = new Date();
          let age = today.getFullYear() - birthDate.getFullYear();

          // Adjust age if birthday hasn't occurred yet this year
          if (
            today.getMonth() < monthIndex ||
            (today.getMonth() === monthIndex && today.getDate() < day)
          ) {
            age--;
          }

          // Format display date (current year)
          const displayDate = new Date(
            today.getFullYear(),
            monthIndex,
            day
          ).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
          });

          return {
            id: `${profile.name}-${profile.date_of_birth}`,
            name: `${profile.name} ${profile.surname || ""}`.trim(),
            age: age.toString(),
            date: displayDate,
            image:
              profile.profile_pic ||
              "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg",
            phone: profile.mobile_no1,
            email: profile.email,
            monthIndex, // For filtering
            day, // For filtering
          };
        })
        .filter(Boolean) // Remove any null entries from failed parsing
        .filter((birthday) => {
          // Apply tab-specific filtering
          if (activeTab === "today") {
            return (
              birthday.monthIndex === currentMonth &&
              birthday.day === currentDay
            );
          } else if (activeTab === "month") {
            return birthday.monthIndex === currentMonth;
          }
          return true; // "all" tab shows everything
        });

      // Sort by upcoming date (next birthday first)
      transformedData.sort((a, b) => {
        // Compare month and day only (using current year)
        if (a.monthIndex !== b.monthIndex) {
          return a.monthIndex - b.monthIndex;
        }
        return a.day - b.day;
      });

      setBirthdays(transformedData);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  // ... rest of the component remains the same ...
  const handleWhatsApp = (phoneNumber: string) => {
    if (phoneNumber) {
      const formattedNumber = phoneNumber.replace(/\D/g, "");
      Linking.openURL(`whatsapp://send?phone=${formattedNumber}`);
    }
  };

  const handleMessage = (phoneNumber: string) => {
    if (phoneNumber) {
      Linking.openURL(`sms:${phoneNumber}`);
    }
  };

  const getBirthdayCountText = () => {
    switch (activeTab) {
      case "today":
        return `${birthdays.length} Today`;
      case "month":
        return `${birthdays.length} This Month`;
      case "all":
        return `${birthdays.length} Total`;
      default:
        return `${birthdays.length} Birthdays`;
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Header Stats */}
      <View className="px-5 py-4 bg-orange-50/50">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-gray-500 text-sm">
              {activeTab === "today"
                ? "Today"
                : activeTab === "month"
                ? "This Month"
                : "All Birthdays"}
            </Text>
            <Text className="text-2xl font-bold text-gray-800 mt-1">
              {getBirthdayCountText()}
            </Text>
          </View>
          <TouchableOpacity className="bg-orange-500 p-3 rounded-full">
            <Ionicons name="notifications-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile-style Tab Layout */}
      <View className="border-b border-gray-200">
        <View className="flex-row">
          {[
            { key: "today", title: "Today" },
            { key: "month", title: "This Month" },
            { key: "all", title: "All" },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key as "today" | "month" | "all")}
              className={`flex-1 py-3 px-1 ${
                activeTab === tab.key
                  ? "border-b-2 border-orange-500"
                  : "border-b-2 border-transparent"
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  activeTab === tab.key ? "text-orange-500" : "text-gray-500"
                }`}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Birthday List */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#f97316" />
          <Text className="text-gray-500 mt-2">Loading birthdays...</Text>
        </View>
      ) : (
        <ScrollView
          className="px-5 pt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {birthdays.length > 0 ? (
            birthdays.map((birthday) => (
              <View
                key={birthday.id}
                className="mb-4 bg-white rounded-2xl border border-gray-100 shadow-sm"
              >
                <View className="p-4">
                  <View className="flex-row items-center">
                    <Image
                      source={{ uri: birthday.image }}
                      className="w-16 h-16 rounded-full border-2 border-orange-100"
                    />
                    <View className="flex-1 ml-4">
                      <Text className="text-lg font-semibold text-gray-800">
                        {birthday.name}
                      </Text>
                      <Text className="text-orange-500 font-medium">
                        Turning {birthday.age}
                      </Text>
                      <Text className="text-gray-500 text-sm mt-0.5">
                        {birthday.date}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row mt-4 pt-4 border-t border-gray-100">
                    <TouchableOpacity
                      className="flex-1 flex-row items-center justify-center bg-green-500/10 py-2.5 rounded-xl mr-2"
                      onPress={() => handleWhatsApp(birthday.phone)}
                    >
                      <Ionicons
                        name="logo-whatsapp"
                        size={20}
                        color="#22c55e"
                      />
                      <Text className="text-green-600 font-medium ml-2">
                        WhatsApp
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-1 flex-row items-center justify-center bg-blue-500/10 py-2.5 rounded-xl"
                      onPress={() => handleMessage(birthday.phone)}
                    >
                      <Ionicons
                        name="chatbubble-outline"
                        size={20}
                        color="#3b82f6"
                      />
                      <Text className="text-blue-600 font-medium ml-2">
                        Message
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View className="items-center justify-center py-10">
              <Ionicons name="calendar-outline" size={48} color="#9ca3af" />
              <Text className="text-gray-500 mt-4">
                No birthdays found for{" "}
                {activeTab === "today"
                  ? "today"
                  : activeTab === "month"
                  ? "this month"
                  : "any time"}
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
