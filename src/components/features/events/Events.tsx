import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function EventsContent() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const upcomingEvents = [
    {
      id: 1,
      title: "Community Diwali Celebration",
      date: "Nov 12, 2024",
      time: "6:00 PM",
      location: "Community Hall, Ahmedabad",
      image:
        "https://images.unsplash.com/photo-1592985684811-6c0f98adb014?q=80&w=1000",
      attendees: 156,
    },
    {
      id: 2,
      title: "Annual General Meeting",
      date: "Nov 15, 2024",
      time: "10:00 AM",
      location: "Samaj Bhavan",
      image:
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000",
      attendees: 89,
    },
    {
      id: 3,
      title: "Youth Leadership Workshop",
      date: "Nov 20, 2024",
      time: "2:00 PM",
      location: "Cultural Center",
      image:
        "https://images.unsplash.com/photo-1540317580256-e6b80d604449?q=80&w=1000",
      attendees: 42,
    },
  ];

  // Calendar grid data
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentMonth = selectedDate.toLocaleString("default", {
    month: "long",
  });
  const currentYear = selectedDate.getFullYear();

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Calendar Section */}
      <View className="bg-white px-4 pt-4 pb-6">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          {currentMonth} {currentYear}
        </Text>

        {/* Days of week */}
        <View className="flex-row justify-between mb-2">
          {daysOfWeek.map((day) => (
            <Text key={day} className="text-gray-500 text-center w-9">
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar grid */}
        <View className="bg-gray-50 rounded-xl p-3">
          {[...Array(5)].map((_, weekIndex) => (
            <View key={weekIndex} className="flex-row justify-between mb-2">
              {[...Array(7)].map((_, dayIndex) => {
                const isToday = weekIndex === 1 && dayIndex === 3;
                const hasEvent = weekIndex === 2 && dayIndex === 1;
                return (
                  <TouchableOpacity
                    key={dayIndex}
                    className={`w-9 h-9 rounded-full items-center justify-center
                      ${
                        isToday
                          ? "bg-orange-500"
                          : hasEvent
                          ? "bg-orange-100"
                          : ""
                      }`}
                  >
                    <Text
                      className={`${
                        isToday
                          ? "text-white"
                          : hasEvent
                          ? "text-orange-500"
                          : "text-gray-700"
                      }`}
                    >
                      {weekIndex * 7 + dayIndex + 1}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>

      {/* Events List */}
      <View className="px-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-gray-800">
            Upcoming Events
          </Text>
          <TouchableOpacity>
            <Text className="text-orange-500 font-medium">View All</Text>
          </TouchableOpacity>
        </View>

        {upcomingEvents.map((event) => (
          <TouchableOpacity
            key={event.id}
            className="flex-row bg-white rounded-xl overflow-hidden mb-3 border border-gray-100"
          >
            <Image
              source={{ uri: event.image }}
              className="w-20 h-20"
              resizeMode="cover"
            />
            <View className="flex-1 p-3">
              <Text
                className="text-base font-bold text-gray-800"
                numberOfLines={1}
              >
                {event.title}
              </Text>

              <View className="flex-row items-center mt-1">
                <Ionicons name="calendar-outline" size={14} color="#666" />
                <Text className="text-gray-600 ml-1 text-xs">{event.date}</Text>
                <Text className="text-gray-400 mx-1">•</Text>
                <Ionicons name="time-outline" size={14} color="#666" />
                <Text className="text-gray-600 ml-1 text-xs">{event.time}</Text>
              </View>

              <View className="flex-row items-center mt-1">
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text className="text-gray-600 ml-1 text-xs" numberOfLines={1}>
                  {event.location}
                </Text>
              </View>
            </View>

            <TouchableOpacity className="justify-center px-3 bg-orange-50">
              <Ionicons name="chevron-forward" size={20} color="#f97316" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
