import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useEvents } from "@/hooks";

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

export default function EventsContent() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetails, setShowEventDetails] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [filteredByDate, setFilteredByDate] = useState(false);
  const { data: events, loading, error } = useEvents();

  // Ref for tracking touch position for swipe gestures
  const touchStartX = useRef(0);

  // Function to handle event selection
  const handleEventPress = (event: Event) => {
    setSelectedEvent(event);
    setShowEventDetails(true);
  };

  // Function to close event details modal
  const closeEventDetails = () => {
    setShowEventDetails(false);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Format time for display (updated for timestamp format)
  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
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

  // Calendar navigation functions
  const goToPreviousMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  };

  const handleYearSelection = (year: number) => {
    const newDate = new Date(selectedDate);
    newDate.setFullYear(year);
    setSelectedDate(newDate);
    setShowYearPicker(false);
  };

  // Calendar grid data
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentMonth = selectedDate.toLocaleString("default", {
    month: "long",
  });
  const currentYear = selectedDate.getFullYear();

  // Generate calendar days for the current month
  const generateCalendarDays = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();

    // First day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    // Last day of the month
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayWeekday = firstDayOfMonth.getDay();

    // Total days in the month
    const daysInMonth = lastDayOfMonth.getDate();

    // Create array for all days to display
    const calendarDays = [];

    // Add empty slots for days before the first day of the month
    for (let i = 0; i < firstDayWeekday; i++) {
      calendarDays.push({ day: null, date: null });
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      calendarDays.push({ day, date });
    }

    return calendarDays;
  };

  // Check if a date has an event (updated for new schema)
  const hasEventOnDate = (date: Date) => {
    if (!date || !displayEvents || displayEvents.length === 0) return false;

    return displayEvents.some((event) => {
      // Check for start_at from new schema
      if (event.start_at) {
        const eventDate = new Date(event.start_at);
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      }

      return false;
    });
  };

  // Check if a date is today
  const isToday = (date: Date | null) => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Generate years for year picker
  const generateYears = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 20; i <= currentYear + 20; i++) {
      years.push(i);
    }
    return years;
  };

  // Calendar days
  const calendarDays = generateCalendarDays();

  // Function to get events for a specific date (updated for new schema)
  const getEventsForDate = (date: Date) => {
    if (!date || !events) return [];

    return events.filter((event) => {
      // Check for start_at from new schema
      if (event.start_at) {
        const eventDate = new Date(event.start_at);
        return (
          eventDate.getDate() === date.getDate() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getFullYear() === date.getFullYear()
        );
      }

      return false;
    });
  };

  // Use actual events data if available
  // If filtered by date, only show events for the selected date
  const displayEvents = filteredByDate
    ? getEventsForDate(selectedDate)
    : events;

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Fixed Calendar Section */}
      <View className="bg-white px-4 pt-4 pb-6 z-10">
        <View
          className="bg-white"
          onTouchStart={(e) => {
            touchStartX.current = e.nativeEvent.pageX;
          }}
          onTouchEnd={(e) => {
            const touchEndX = e.nativeEvent.pageX;
            const diff = touchStartX.current - touchEndX;

            // Swipe threshold (50px)
            if (Math.abs(diff) > 50) {
              if (diff > 0) {
                // Swipe left - go to next month
                goToNextMonth();
              } else {
                // Swipe right - go to previous month
                goToPreviousMonth();
              }
            }
          }}
        >
          {/* Month and Year Header with Navigation */}
          <View className="flex-row justify-between items-center mb-4">
            <TouchableOpacity onPress={goToPreviousMonth}>
              <Ionicons name="chevron-back" size={24} color="#666" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowYearPicker(!showYearPicker)}
            >
              <Text className="text-2xl font-bold text-gray-800">
                {currentMonth} {currentYear}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={goToNextMonth}>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* Year Picker Modal */}
          {showYearPicker && (
            <View className="bg-white rounded-xl shadow-md p-4 mb-4 border border-gray-200">
              <ScrollView
                className="max-h-40"
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
                onTouchStart={(e) => e.stopPropagation()}
              >
                <View className="flex-row flex-wrap justify-center">
                  {generateYears().map((year) => (
                    <TouchableOpacity
                      key={year}
                      onPress={() => handleYearSelection(year)}
                      className={`m-1 px-4 py-2 rounded-full ${
                        year === currentYear ? "bg-orange-500" : "bg-gray-100"
                      }`}
                    >
                      <Text
                        className={`${
                          year === currentYear ? "text-white" : "text-gray-700"
                        } font-medium`}
                      >
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

          {/* Days of week */}
          <View className="flex-row mb-2">
            {daysOfWeek.map((day) => (
              <Text key={day} className="text-gray-500 text-center flex-1">
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar grid */}
          <View className="bg-gray-50 rounded-xl p-3">
            <View className="flex-row flex-wrap">
              {calendarDays.map((dayObj, index) => {
                const dayHasEvent = dayObj.date && hasEventOnDate(dayObj.date);
                const dayIsToday = dayObj.date && isToday(dayObj.date);

                return (
                  <TouchableOpacity
                    key={index}
                    className={`w-[14.28%] items-center justify-center
                      ${dayObj.day ? "py-1" : ""}`}
                    disabled={!dayObj.day}
                    onPress={() => {
                      if (dayObj.date) {
                        const newDate = new Date(dayObj.date);
                        setSelectedDate(newDate);

                        // If the date has events, filter to show only those events
                        if (hasEventOnDate(dayObj.date)) {
                          setFilteredByDate(true);
                        }
                      }
                    }}
                  >
                    {dayObj.day ? (
                      <View
                        className={`items-center w-8 h-8 rounded-full justify-center
                          ${dayIsToday ? "bg-orange-500" : ""}`}
                      >
                        <Text
                          className={`${
                            dayIsToday
                              ? "text-white"
                              : dayHasEvent
                              ? "text-orange-500"
                              : "text-gray-700"
                          }`}
                        >
                          {dayObj.day}
                        </Text>
                        {dayHasEvent && !dayIsToday && (
                          <View className="w-1 h-1 bg-orange-500 rounded-full mt-0.5" />
                        )}
                      </View>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </View>

      {/* Fixed Events Header */}
      <View className="px-4 bg-white z-10">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-gray-800">
            {filteredByDate
              ? `Events on ${formatDate(selectedDate.toISOString())}`
              : "Upcoming Events"}
          </Text>
          <TouchableOpacity onPress={() => setFilteredByDate(false)}>
            <Text className="text-orange-500 font-medium">View All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Events List */}
      <ScrollView className="flex-1 bg-white px-4">
        {loading ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" color="#f97316" />
            <Text className="text-gray-500 mt-4">Loading events...</Text>
          </View>
        ) : error ? (
          <View className="items-center justify-center py-10">
            <Ionicons name="alert-circle-outline" size={48} color="#9ca3af" />
            <Text className="text-gray-500 mt-4">Error loading events</Text>
          </View>
        ) : !displayEvents || displayEvents.length === 0 ? (
          <View className="items-center justify-center py-10">
            <Ionicons name="calendar-outline" size={48} color="#9ca3af" />
            <Text className="text-gray-500 mt-4">No upcoming events</Text>
          </View>
        ) : (
          displayEvents.map((event) => (
            <TouchableOpacity
              key={event.id}
              className="flex-row bg-white rounded-xl overflow-hidden mb-3 border border-gray-100"
              onPress={() => handleEventPress(event)}
            >
              <Image
                source={{ uri: event.image || event.image_url }}
                className="w-20 h-20"
                resizeMode="cover"
              />
              <View className="flex-1 p-3">
                <Text
                  className="text-base font-bold text-gray-800"
                  numberOfLines={1}
                >
                  {event.name}
                </Text>

                <View className="flex-row items-center mt-1">
                  <Ionicons name="calendar-outline" size={14} color="#666" />
                  <Text className="text-gray-600 ml-1 text-xs">
                    {formatDate(event.start_at)}
                  </Text>
                  <Text className="text-gray-400 mx-1">•</Text>
                  <Ionicons name="time-outline" size={14} color="#666" />
                  <Text className="text-gray-600 ml-1 text-xs">
                    {formatTime(event.start_at)}
                  </Text>
                </View>

                {/* <View className="flex-row items-center mt-1">
                  <Ionicons name="location-outline" size={14} color="#666" />
                  <Text
                    className="text-gray-600 ml-1 text-xs"
                    numberOfLines={1}
                  >
                    {event.location}
                  </Text>
                </View> */}
              </View>
            </TouchableOpacity>
          ))
        )}
        {/* Add some padding at the bottom for better scrolling experience */}
        <View className="h-6" />
      </ScrollView>

      {/* Event Details Modal */}
      <Modal
        visible={showEventDetails}
        animationType="slide"
        transparent={true}
        onRequestClose={closeEventDetails}
      >
        <View className="flex-1 justify-end">
          <View className="bg-white rounded-t-3xl shadow-lg p-5 h-3/4">
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
    </SafeAreaView>
  );
}