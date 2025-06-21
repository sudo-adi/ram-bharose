import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { useEvents } from "@/hooks";
import React from "react";

type Event = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  created_at: string;
  start_at: string;
  duration: string;
  organizers: string[];
  submitted_at: string;
  image_url: string;
  location: string;
  city: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  image?: string; // For backward compatibility with useEvents hook
};

export default function EventsCarousel({ onViewAll }) {
  const { data: events, loading, error } = useEvents();
  const eventScrollViewRef = useRef(null);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const screenWidth = Dimensions.get("window").width;

  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  const closeEventDetails = () => {
    setShowEventDetails(false);
    setSelectedEvent(null);
  };

  // Get only the 5 most recent events
  const recentEvents = events
    ? [...events]
        .sort(
          (a, b) =>
            new Date(b.start_at).getTime() - new Date(a.start_at).getTime()
        )
        .slice(0, 5)
    : [];

  // Auto scroll for events carousel
  useEffect(() => {
    if (!recentEvents || recentEvents.length === 0) return;

    const intervalId = setInterval(() => {
      if (eventScrollViewRef.current) {
        const nextIndex = (currentEventIndex + 1) % recentEvents.length;
        const scrollX = nextIndex * (screenWidth - 20);
        eventScrollViewRef.current.scrollTo({ x: scrollX, animated: true });
        setCurrentEventIndex(nextIndex);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentEventIndex, recentEvents, screenWidth]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Handle manual scroll end to update current index
  const handleEventScroll = (event) => {
    if (!recentEvents || recentEvents.length === 0) return;

    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / (screenWidth - 20));
    if (
      newIndex !== currentEventIndex &&
      newIndex >= 0 &&
      newIndex < recentEvents.length
    ) {
      setCurrentEventIndex(newIndex);
    }
  };

  // Format date and time for display
  const formatEventTime = (event: Event) => {
    try {
      const startDate = new Date(event.start_at);
      const month = startDate.toLocaleString("default", { month: "short" });
      const day = startDate.getDate();
      const time = startDate.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

      return `${month} ${day} • ${time}`;
    } catch (e) {
      return event.start_at || "Date TBD";
    }
  };

  // Format duration from interval string
  const formatDuration = (duration: string) => {
    if (!duration) return "";
    
    // Parse PostgreSQL interval format (e.g., "02:00:00" or "1 day 02:00:00")
    const timeMatch = duration.match(/(\d{1,2}):(\d{2}):(\d{2})/);
    const dayMatch = duration.match(/(\d+)\s+day/);
    
    if (timeMatch) {
      const hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      let result = "";
      
      if (dayMatch) {
        const days = parseInt(dayMatch[1], 10);
        result += `${days} day${days > 1 ? 's' : ''} `;
      }
      
      if (hours > 0) {
        result += `${hours}h `;
      }
      if (minutes > 0) {
        result += `${minutes}m`;
      }
      
      return result.trim();
    }
    
    return duration;
  };

  // Calculate end time from start time and duration
  const getEndTime = (startAt: string, duration: string) => {
    if (!startAt || !duration) return null;
    
    try {
      const start = new Date(startAt);
      const timeMatch = duration.match(/(\d{1,2}):(\d{2}):(\d{2})/);
      const dayMatch = duration.match(/(\d+)\s+day/);
      
      let totalMinutes = 0;
      
      if (dayMatch) {
        totalMinutes += parseInt(dayMatch[1], 10) * 24 * 60;
      }
      
      if (timeMatch) {
        const hours = parseInt(timeMatch[1], 10);
        const minutes = parseInt(timeMatch[2], 10);
        totalMinutes += hours * 60 + minutes;
      }
      
      const end = new Date(start.getTime() + totalMinutes * 60000);
      return end.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } catch (e) {
      return null;
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
        <TouchableOpacity onPress={onViewAll}>
          <Text className="text-orange-500 font-medium">View All</Text>
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
            onPress={() => handleEventPress(event)}
          >
            <View className="h-[200px] rounded-2xl overflow-hidden shadow-md">
              <Image
                source={{ uri: event.image || event.image_url }}
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
                  {event.name}
                </Text>
                <Text className="text-white/90 text-sm mt-1" numberOfLines={2}>
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

      {/* Event Details Modal */}
      <Modal
        visible={showEventDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={closeEventDetails}
      >
        <View className="flex-1 justify-end">
          <View className="bg-white rounded-t-3xl shadow-lg p-5 h-4/5">
            {/* Close button */}
            <TouchableOpacity
              onPress={closeEventDetails}
              className="absolute right-5 top-5 z-10 bg-gray-100 rounded-full p-2"
            >
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>

            {selectedEvent && (
              <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
              >
                {/* Event Image */}
                <Image
                  source={{ uri: selectedEvent.image || selectedEvent.image_url }}
                  className="w-full h-48 rounded-xl mb-4"
                  resizeMode="cover"
                />

                {/* Event Title */}
                <Text className="text-2xl font-bold text-gray-800 mb-2">
                  {selectedEvent.name}
                </Text>

                {/* Event Details */}
                <View className="mb-4">
                  <View className="flex-row items-center mb-2">
                    <Ionicons name="calendar-outline" size={18} color="#666" />
                    <Text className="text-gray-700 ml-2">
                      {formatDate(selectedEvent.start_at)}
                    </Text>
                  </View>

                  <View className="flex-row items-center mb-2">
                    <Ionicons name="time-outline" size={18} color="#666" />
                    <Text className="text-gray-700 ml-2">
                      {formatTime(selectedEvent.start_at)}
                      {selectedEvent.duration && getEndTime(selectedEvent.start_at, selectedEvent.duration) && (
                        ` - ${getEndTime(selectedEvent.start_at, selectedEvent.duration)}`
                      )}
                    </Text>
                  </View>

                  {selectedEvent.duration && (
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="hourglass-outline" size={18} color="#666" />
                      <Text className="text-gray-700 ml-2">
                        Duration: {formatDuration(selectedEvent.duration)}
                      </Text>
                    </View>
                  )}
{/* 
                  <View className="flex-row items-start mb-2">
                    <Ionicons
                      name="location-outline"
                      size={18}
                      color="#666"
                      style={{ marginTop: 2 }}
                    />
                    <View className="flex-1">
                      <Text className="text-gray-700 ml-2">
                        {selectedEvent.location}
                      </Text>
                      {selectedEvent.city && (
                        <Text className="text-gray-500 ml-2">
                          {selectedEvent.city}
                        </Text>
                      )}
                    </View>
                  </View> */}

                  {selectedEvent.organizers && selectedEvent.organizers.length > 0 && (
                    <View className="flex-row items-start mb-2">
                      <Ionicons
                        name="people-outline"
                        size={18}
                        color="#666"
                        style={{ marginTop: 2 }}
                      />
                      <View className="flex-1">
                        <Text className="text-gray-700 ml-2">
                          Organizers: {selectedEvent.organizers.join(", ")}
                        </Text>
                      </View>
                    </View>
                  )}

                  {selectedEvent.contact_phone && (
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="call-outline" size={18} color="#666" />
                      <Text className="text-gray-700 ml-2">
                        {selectedEvent.contact_phone}
                      </Text>
                    </View>
                  )}

                  {selectedEvent.contact_email && (
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="mail-outline" size={18} color="#666" />
                      <Text className="text-gray-700 ml-2">
                        {selectedEvent.contact_email}
                      </Text>
                    </View>
                  )}

                  {selectedEvent.website && (
                    <View className="flex-row items-center mb-2">
                      <Ionicons name="globe-outline" size={18} color="#666" />
                      <Text className="text-gray-700 ml-2">
                        {selectedEvent.website}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Event Description */}
                <View className="mb-4">
                  <Text className="text-lg font-bold text-gray-800 mb-2">
                    About Event
                  </Text>
                  <Text className="text-gray-700 leading-6">
                    {selectedEvent.description}
                  </Text>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

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
}