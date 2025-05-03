import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Home() {
  const userName = "Harshadbhai";
  const eventScrollViewRef = useRef(null);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  // Event data
  const events = [
    {
      id: 1,
      image:
        "https://images.unsplash.com/photo-1592985684811-6c0f98adb014?q=80&w=1000",
      title: "Community Diwali Celebration 2024",
      description: "Join us for the grand celebration with",
      time: "Jan 15 • 3 min",
    },
    {
      id: 2,
      image:
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000",
      title: "Educational Workshop",
      description: "Resources for community growth",
      time: "Jan 20 • 2 hours",
    },
    {
      id: 3,
      image:
        "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1000",
      title: "Health Camp",
      description: "Free health checkups for all members",
      time: "Feb 5 • All day",
    },
  ];

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Auto scroll for events carousel
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (eventScrollViewRef.current) {
        const nextIndex = (currentEventIndex + 1) % events.length;
        const scrollX = nextIndex * (screenWidth - 40); // Account for padding
        eventScrollViewRef.current.scrollTo({ x: scrollX, animated: true });
        setCurrentEventIndex(nextIndex);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentEventIndex]);

  // Handle manual scroll end to update current index
  const handleEventScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / (screenWidth - 40)); // Account for padding
    if (
      newIndex !== currentEventIndex &&
      newIndex >= 0 &&
      newIndex < events.length
    ) {
      setCurrentEventIndex(newIndex);
    }
  };

  // Screen dimensions
  const screenWidth = Dimensions.get("window").width;

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />

      {/* Header with gradient */}
      <LinearGradient
        colors={["#ff8c37", "#ff5f37"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="pt-12 pb-6 px-5 rounded-b-3xl shadow-lg"
      >
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-white text-sm opacity-90">
              {getGreeting()} ☀️
            </Text>
            <Text className="text-2xl font-bold text-white">
              Namaste, {userName}
            </Text>
          </View>
          <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
            <View className="relative">
              <Ionicons name="notifications-outline" size={22} color="white" />
              <View className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Community Stats - Moved to top */}
        <View className="flex-row justify-between bg-white/15 p-4 rounded-2xl mb-2">
          <View className="items-center">
            <Text className="text-2xl font-bold text-white">4,027</Text>
            <Text className="text-white text-xs mt-1">Total Members</Text>
          </View>
          <View className="h-full w-px bg-white/20" />
          <View className="items-center">
            <Text className="text-2xl font-bold text-white">2,069</Text>
            <Text className="text-white text-xs mt-1">Males</Text>
          </View>
          <View className="h-full w-px bg-white/20" />
          <View className="items-center">
            <Text className="text-2xl font-bold text-white">1,958</Text>
            <Text className="text-white text-xs mt-1">Females</Text>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        className="flex-1 pt-6"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Events Carousel */}
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

          <ScrollView
            ref={eventScrollViewRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            onMomentumScrollEnd={handleEventScroll}
            snapToInterval={screenWidth - 40}
            decelerationRate="fast"
            contentContainerStyle={{
              paddingHorizontal: 20,
            }}
          >
            {events.map((event, index) => (
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
                  <LinearGradient
                    colors={["transparent", "rgba(0,0,0,0.8)"]}
                    className="absolute inset-0 flex justify-end p-5"
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
                        {event.time}
                      </Text>
                    </View>
                  </LinearGradient>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Carousel Indicators */}
          <View className="flex-row justify-center mt-4">
            {events.map((_, index) => (
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

        {/* Family Updates */}
        <View className="px-5 mb-8">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Family Updates ❤️
          </Text>
          <View className="flex-row justify-between">
            <TouchableOpacity className="bg-white rounded-2xl p-5 w-[48%] shadow-sm border border-gray-100">
              <View className="items-center mb-3">
                <View className="bg-orange-100 p-3 rounded-full mb-2">
                  <Ionicons name="people" size={24} color="#ff8c37" />
                </View>
                <Text className="font-bold text-gray-800 text-sm text-center">
                  My Family
                </Text>
                <Text className="text-gray-500 text-xs mt-1 text-center">
                  View members
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="bg-white rounded-2xl p-5 w-[48%] shadow-sm border border-gray-100">
              <View className="items-center mb-3">
                <View className="bg-orange-100 p-3 rounded-full mb-2">
                  <Ionicons name="git-network" size={24} color="#ff8c37" />
                </View>
                <Text className="font-bold text-gray-800 text-sm text-center">
                  Family Tree
                </Text>
                <Text className="text-gray-500 text-xs mt-1 text-center">
                  View lineage
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Women-Led Businesses */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center px-5 mb-4">
            <Text className="text-lg font-bold text-gray-800">
              Women-Led Businesses 🏆
            </Text>
            <TouchableOpacity>
              <Text className="text-orange-500 text-sm font-medium">
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
          >
            {[
              {
                name: "Priya's Boutique",
                category: "Fashion & Apparel",
                location: "Ahmedabad",
                rating: 4.8,
                image:
                  "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000",
              },
              {
                name: "Meera's Crafts",
                category: "Handmade Items",
                location: "Vadodara",
                rating: 4.5,
                image:
                  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000",
              },
              {
                name: "Divya Catering",
                category: "Food Services",
                location: "Surat",
                rating: 4.9,
                image:
                  "https://images.unsplash.com/photo-1604329760661-e71dc83f8f26?q=80&w=1000",
              },
            ].map((business, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-2xl mr-4 shadow-sm overflow-hidden w-64 border border-gray-100"
              >
                <View className="h-28 w-full">
                  <Image
                    source={{ uri: business.image }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <View className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-lg">
                    <View className="flex-row items-center">
                      <Ionicons name="star" size={12} color="#FFB800" />
                      <Text className="ml-1 font-bold text-xs text-gray-800">
                        {business.rating}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="p-4">
                  <Text className="font-bold text-gray-800">
                    {business.name}
                  </Text>
                  <Text className="text-gray-500 text-xs mt-1">
                    {business.category}
                  </Text>

                  <View className="flex-row items-center mt-2">
                    <Ionicons name="location-outline" size={14} color="#666" />
                    <Text className="text-gray-600 text-xs ml-1">
                      {business.location}
                    </Text>
                  </View>

                  <TouchableOpacity className="mt-3 bg-orange-50 rounded-lg py-2">
                    <Text className="text-orange-500 font-medium text-xs text-center">
                      Visit Business
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Community Support */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center px-5 mb-4">
            <Text className="text-lg font-bold text-gray-800">
              Community Support 💛
            </Text>
            <TouchableOpacity>
              <Text className="text-orange-500 text-sm font-medium">
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
          >
            {[
              {
                title: "Education for Rural Children",
                description:
                  "Help provide education to underprivileged children in rural areas",
                progress: 65,
                raised: "₹32,500",
                goal: "₹50,000",
                image:
                  "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1000",
                icon: "book-education",
              },
              {
                title: "Women Empowerment Program",
                description:
                  "Support skill development and entrepreneurship for women",
                progress: 40,
                raised: "₹30,000",
                goal: "₹75,000",
                image:
                  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000",
                icon: "account-group",
              },
              {
                title: "Clean Water Initiative",
                description: "Provide clean drinking water to remote villages",
                progress: 28,
                raised: "₹14,000",
                goal: "₹50,000",
                image:
                  "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1000",
                icon: "water",
              },
            ].map((cause, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-2xl overflow-hidden mr-4 shadow-sm w-80 border border-gray-100"
              >
                <Image
                  source={{ uri: cause.image }}
                  className="w-full h-40"
                  resizeMode="cover"
                />
                <View className="absolute top-3 left-3 bg-white/90 p-2 rounded-lg">
                  <MaterialCommunityIcons
                    name={cause.icon as any}
                    size={18}
                    color="#ff8c37"
                  />
                </View>

                <View className="p-4">
                  <Text className="font-bold text-gray-800 text-base">
                    {cause.title}
                  </Text>
                  <Text className="text-gray-500 text-xs mt-1 mb-3">
                    {cause.description}
                  </Text>

                  <View className="h-2 bg-gray-100 rounded-full mb-2">
                    <View
                      className="h-2 rounded-full"
                      style={{
                        width: `${cause.progress}%`,
                        backgroundColor: "#ff8c37",
                      }}
                    />
                  </View>

                  <View className="flex-row justify-between mb-4">
                    <Text className="text-gray-500 text-xs">
                      {cause.progress}% of {cause.goal}
                    </Text>
                    <Text className="text-orange-500 text-xs font-medium">
                      {cause.raised} raised
                    </Text>
                  </View>

                  <TouchableOpacity
                    className="py-3 rounded-xl"
                    style={{ backgroundColor: "#ff8c37" }}
                  >
                    <Text className="text-white font-medium text-center text-sm">
                      🙏 Donate Now
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Directory & Members Section - Redesigned as a grid */}
        <View className="px-5 mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">
              Directory & Members 🏢
            </Text>
            <TouchableOpacity>
              <Text className="text-orange-500 text-sm font-medium">
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row flex-wrap justify-between">
            {[
              {
                icon: "people",
                color: "#ff8c37",
                title: "E-VastiPatrak",
                description: "Member search",
              },
              {
                icon: "medkit",
                color: "#ff8c37",
                title: "Doctors",
                description: "Healthcare",
              },
              {
                icon: "business",
                color: "#ff8c37",
                title: "Businesses",
                description: "Local services",
              },
              {
                icon: "home",
                color: "#ff8c37",
                title: "Housing",
                description: "Rentals & PG",
              },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-2xl p-4 w-[48%] shadow-sm border border-gray-100 mb-3"
              >
                <View className="flex-row items-center mb-2">
                  <View
                    className="p-2 rounded-full mr-3"
                    style={{ backgroundColor: `${item.color}15` }}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={item.color}
                    />
                  </View>
                  <View>
                    <Text className="font-bold text-gray-800 text-sm">
                      {item.title}
                    </Text>
                    <Text className="text-gray-500 text-xs">
                      {item.description}
                    </Text>
                  </View>
                </View>
                <View className="w-full h-px bg-gray-100 mb-2" />
                <Text className="text-xs text-orange-500 font-medium text-right">
                  View →
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Stay Updated - News */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center px-5 mb-4">
            <Text className="text-lg font-bold text-gray-800">
              Stay Updated 📰
            </Text>
            <TouchableOpacity>
              <Text className="text-orange-500 text-sm font-medium">
                View All
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
          >
            {[
              {
                title: "Community Center Renovation Complete",
                description:
                  "The newly renovated center will open next week with modern facilities",
                time: "2 hours ago",
                image:
                  "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1000",
              },
              {
                title: "Annual Cultural Festival Dates Announced",
                description:
                  "Mark your calendars for the biggest cultural event of the year",
                time: "1 day ago",
                image:
                  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1000",
              },
              {
                title: "Scholarship Program for Students",
                description:
                  "Applications now open for the 2024 community scholarship program",
                time: "3 days ago",
                image:
                  "https://images.unsplash.com/photo-1521791136064-7986c2920216?q=80&w=1000",
              },
            ].map((news, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-2xl mr-4 shadow-sm overflow-hidden w-72 border border-gray-100"
              >
                <Image
                  source={{ uri: news.image }}
                  className="w-full h-36"
                  resizeMode="cover"
                />
                <View className="p-4">
                  <Text className="font-bold text-gray-800 text-base mb-1">
                    {news.title}
                  </Text>
                  <Text className="text-gray-500 text-xs mb-3">
                    {news.description}
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <Ionicons name="time-outline" size={12} color="#9ca3af" />
                      <Text className="text-gray-400 text-xs ml-1">
                        {news.time}
                      </Text>
                    </View>
                    <TouchableOpacity className="flex-row items-center">
                      <Text className="text-orange-500 text-xs font-medium mr-1">
                        Read More
                      </Text>
                      <Ionicons
                        name="chevron-forward"
                        size={12}
                        color="#ff8c37"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
