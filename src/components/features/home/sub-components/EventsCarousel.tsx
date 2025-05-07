import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { useEvents } from "@/hooks/useSupabase";
import React from "react";

type Event = {
  id: string;
  image: string;
  title: string;
  description: string;
  event_date: string;
  start_time: string;
  end_time: string;
  location: string;
  city: string;
  organizer_name: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  created_at: string;
};

const EventsCarousel = () => {
  const { data: events, loading, error } = useEvents();
  const eventScrollViewRef = useRef(null);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const screenWidth = Dimensions.get("window").width;

  // Get only the 5 most recent events
  const recentEvents = events
    ? [...events]
        .sort(
          (a, b) =>
            new Date(b.event_date).getTime() - new Date(a.event_date).getTime()
        )
        .slice(0, 5)
    : [];

  // Auto scroll for events carousel
  useEffect(() => {
    if (!recentEvents || recentEvents.length === 0) return;

    const intervalId = setInterval(() => {
      if (eventScrollViewRef.current) {
        const nextIndex = (currentEventIndex + 1) % recentEvents.length;
        const scrollX = nextIndex * (screenWidth - 20); // Account for padding
        eventScrollViewRef.current.scrollTo({ x: scrollX, animated: true });
        setCurrentEventIndex(nextIndex);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentEventIndex, recentEvents, screenWidth]);

  // Handle manual scroll end to update current index
  const handleEventScroll = (event) => {
    if (!recentEvents || recentEvents.length === 0) return;

    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / (screenWidth - 20)); // Account for padding
    if (
      newIndex !== currentEventIndex &&
      newIndex >= 0 &&
      newIndex < recentEvents.length
    ) {
      setCurrentEventIndex(newIndex);
    }
  };

  // Format date and time for display
  const formatEventTime = (event) => {
    try {
      const date = new Date(event.event_date);
      const month = date.toLocaleString("default", { month: "short" });
      const day = date.getDate();

      // Format time if available
      let timeInfo = "";
      if (event.start_time) {
        timeInfo = ` • ${event.start_time}`;
        if (event.end_time) {
          timeInfo += ` - ${event.end_time}`;
        }
      }

      return `${month} ${day}${timeInfo}`;
    } catch (e) {
      return event.event_date || "Date TBD";
    }
  };

  if (loading) {
    return (
      <View className="mb-8 items-center justify-center py-8">
        <ActivityIndicator color="#ff8c37" />
      </View>
    );
  }

  if (error || !recentEvents || recentEvents.length === 0) {
    return (
      <View className="mb-8">
        <View className="flex-row justify-between items-center px-5 mb-4">
          <Text className="text-lg font-bold text-gray-800">
            Upcoming Events
          </Text>
          <TouchableOpacity>
            <Text className="text-orange-500 text-sm font-medium">
              View All
            </Text>
          </TouchableOpacity>
        </View>
        <View className="px-5 py-8 items-center">
          <Text className="text-gray-500">
            No events available at the moment
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-8">
      <View className="flex-row justify-between items-center px-5 mb-4">
        <Text className="text-lg font-bold text-gray-800">Upcoming Events</Text>
        <TouchableOpacity>
          <Text className="text-orange-500 text-sm font-medium">View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={eventScrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        onMomentumScrollEnd={handleEventScroll}
        snapToInterval={screenWidth - 20}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingHorizontal: 20,
        }}
      >
        {recentEvents.map((event, index) => (
          <TouchableOpacity
            key={event.id}
            style={{
              width: screenWidth - 40,
              marginRight: 20,
            }}
            className="overflow-hidden"
          >
            <View className="h-[200px] rounded-2xl overflow-hidden shadow-md">
              <Image
                source={{ uri: event.image }}
                className="w-full h-full"
                resizeMode="cover"
              />
              <View
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                  justifyContent: "flex-end",
                  padding: 20,
                  backgroundColor: "rgba(0,0,0,0.5)",
                }}
              >
                <Text className="text-white font-bold text-xl">
                  {event.title}
                </Text>
                <Text className="text-white/90 text-sm mt-1">
                  {event.description}
                </Text>
                <View className="flex-row items-center mt-2">
                  <Ionicons name="time-outline" size={14} color="white" />
                  <Text className="text-white/80 text-xs ml-1">
                    {formatEventTime(event)}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Carousel Indicators */}
      <View className="flex-row justify-center mt-4">
        {recentEvents.map((_, index) => (
          <View
            key={index}
            className={`h-2 mx-1 rounded-full ${
              index === currentEventIndex
                ? "w-6 bg-orange-500"
                : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </View>
    </View>
  );
};

export default EventsCarousel;
