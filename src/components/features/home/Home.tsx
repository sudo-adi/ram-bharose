import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

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
        const scrollX = nextIndex * (screenWidth - 20); // Account for margin
        eventScrollViewRef.current.scrollTo({ x: scrollX, animated: true });
        setCurrentEventIndex(nextIndex);
      }
    }, 3000);

    return () => clearInterval(intervalId);
  }, [currentEventIndex]);

  // Handle manual scroll end to update current index
  const handleEventScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / (screenWidth - 20)); // Account for margin
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
  const cardMargin = 10; // Space between cards

  return (
    <View className="flex-1 bg-white">
      {/* Sticky Header - Moved outside ScrollView */}
      <View className="px-5 py-4 mt-12 bg-white">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-gray-500">{getGreeting()} ☀️</Text>
            <Text className="text-2xl font-bold text-gray-800">
              Welcome, {userName}!
            </Text>
          </View>
          <TouchableOpacity className="w-10 h-10 bg-orange-50 rounded-full items-center justify-center">
            <View className="relative">
              <Ionicons
                name="notifications-outline"
                size={22}
                color="#f97316"
              />
              <View className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Remove the old header and spacer */}
        {/* Events Carousel */}
        <View className="pb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4 px-5">
            Upcoming Events
          </Text>
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
              paddingRight: 20,
            }}
          >
            {events.map((event, index) => (
              <TouchableOpacity
                key={event.id}
                style={{
                  width: screenWidth - 40,
                  marginRight: index < events.length - 1 ? cardMargin : 0,
                }}
              >
                <View className="h-[180px] overflow-hidden relative rounded-xl shadow-sm">
                  <Image
                    source={{ uri: event.image }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  <View className="absolute inset-0 bg-black/30 p-4 flex justify-end">
                    <Text className="text-white font-bold text-lg">
                      {event.title}
                    </Text>
                    <Text className="text-white text-sm mt-1">
                      {event.description}
                    </Text>
                    <Text className="text-white/80 text-xs mt-2">
                      {event.time}
                    </Text>
                  </View>
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
        <View className="px-5 pb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Family Updates ❤️
          </Text>
          <View className="flex-row justify-between">
            <TouchableOpacity className="bg-pink-50 rounded-xl p-4 w-[48%] border border-pink-100">
              <View className="flex-row items-center">
                <View className="bg-pink-100 p-2 rounded-full">
                  <Ionicons name="people" size={20} color="#be185d" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="font-bold text-gray-800 text-sm">
                    My Family
                  </Text>
                  <Text className="text-gray-600 text-xs mt-1">
                    View members
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity className="bg-indigo-50 rounded-xl p-4 w-[48%] border border-indigo-100">
              <View className="flex-row items-center">
                <View className="bg-indigo-100 p-2 rounded-full">
                  <Ionicons name="git-network" size={20} color="#4338ca" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="font-bold text-gray-800 text-sm">
                    Family Tree
                  </Text>
                  <Text className="text-gray-600 text-xs mt-1">
                    View lineage
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Women-Led Businesses */}
        <View className="px-5 pb-6">
          <View className="flex-row justify-between items-center mb-4 px-1">
            <Text className="text-xl font-bold text-gray-800">
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
            contentContainerStyle={{ paddingRight: 20 }}
            className="p-1"
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
                className="bg-white rounded-xl p-4 w-56 mr-3 shadow-sm border border-gray-100"
              >
                <View className="flex-row items-center mb-3">
                  <Image
                    source={{ uri: business.image }}
                    className="w-10 h-10 rounded-full"
                  />
                  <View className="ml-3">
                    <Text className="font-bold text-sm">{business.name}</Text>
                    <Text className="text-gray-500 text-xs">
                      {business.category}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="location-outline" size={14} color="#666" />
                  <Text className="text-gray-600 text-xs ml-1">
                    {business.location}
                  </Text>
                </View>
                <View className="flex-row items-center justify-between mt-3">
                  <View className="flex-row items-center">
                    <Ionicons name="star" size={14} color="#FFB800" />
                    <Text className="ml-1 font-medium text-xs">
                      {business.rating}
                    </Text>
                  </View>
                  <TouchableOpacity className="bg-orange-100 px-2 py-1 rounded-md">
                    <Text className="text-orange-600 font-medium text-xs">
                      Visit
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Community Support */}
        <View className="px-5 pb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4 p-1">
            Community Support 💛
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
            className="p-1"
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
                className="bg-white rounded-xl p-4 w-80 mr-3 shadow-sm border border-gray-100"
              >
                <View className="relative">
                  <Image
                    source={{ uri: cause.image }}
                    className="w-full h-32 rounded-lg mb-3"
                    resizeMode="cover"
                  />
                  <View className="absolute top-2 right-2 bg-rose-500/90 p-2 rounded-full">
                    <MaterialCommunityIcons
                      name={cause.icon as any}
                      size={16}
                      color="white"
                    />
                  </View>
                </View>

                <Text className="font-bold text-gray-800 text-sm mb-1">
                  {cause.title}
                </Text>
                <Text className="text-gray-500 text-xs mb-3">
                  {cause.description}
                </Text>

                <View className="h-1.5 bg-gray-200 rounded-full mb-1">
                  <View
                    className="h-1.5 rounded-full"
                    style={{
                      width: `${cause.progress}%`,
                      backgroundColor: "#f43f5e", // rose-500
                    }}
                  />
                </View>

                <View className="flex-row justify-between mb-3">
                  <Text className="text-gray-500 text-xs">
                    {cause.progress}% of {cause.goal}
                  </Text>
                  <Text className="text-rose-600 text-xs font-medium">
                    {cause.raised} raised
                  </Text>
                </View>

                <TouchableOpacity
                  className="py-2 rounded-lg mt-1"
                  style={{ backgroundColor: "#fb923c" }} // amber-400
                >
                  <Text className="text-white font-medium text-center text-sm">
                    🙏 Donate Now
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Enhanced Directory & Members Section */}
        <View className="px-5 pb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">
              Directory & Members 🏢
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
            contentContainerStyle={{ paddingRight: 20 }}
            className="pb-2"
          >
            {[
              {
                icon: "people",
                color: "#3b82f6",
                title: "E-VastiPatrak",
                description: "Member search",
                image:
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500",
              },
              {
                icon: "medkit",
                color: "#10b981",
                title: "Doctors",
                description: "Healthcare",
                image:
                  "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=500",
              },
              {
                icon: "business",
                color: "#f59e0b",
                title: "Businesses",
                description: "Local services",
                image:
                  "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500",
              },
              {
                icon: "home",
                color: "#8b5cf6",
                title: "Housing",
                description: "Rentals & PG",
                image:
                  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=500",
              },
            ].map((item, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-xl p-4 w-36 mr-3 shadow-sm border border-gray-100 items-center"
              >
                <View
                  className="p-4 rounded-full mb-3"
                  style={{ backgroundColor: `${item.color}10` }}
                >
                  <Ionicons
                    name={
                      item.icon as React.ComponentProps<typeof Ionicons>["name"]
                    }
                    size={24}
                    color={item.color}
                  />
                </View>
                <Text className="font-bold text-gray-800 text-center text-sm">
                  {item.title}
                </Text>
                <Text className="text-gray-500 text-xs mt-1 text-center">
                  {item.description}
                </Text>
                <View className="w-full h-px bg-gray-100 my-3" />
                <Text className="text-xs text-blue-500 font-medium">
                  View →
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Stay Updated */}
        <View className="px-5 pb-6">
          <View className="flex-row justify-between items-center mb-4 px-1">
            <Text className="text-xl font-bold text-gray-800">
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
            contentContainerStyle={{ paddingRight: 20 }}
            className="p-1"
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
                className="bg-white rounded-xl p-4 w-64 mr-3 shadow-sm border border-gray-100"
              >
                <Image
                  source={{ uri: news.image }}
                  className="w-full h-32 rounded-lg mb-3"
                  resizeMode="cover"
                />
                <Text className="font-bold text-gray-800 text-sm mb-1">
                  {news.title}
                </Text>
                <Text className="text-gray-500 text-xs mb-3">
                  {news.description}
                </Text>
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-400 text-xs">{news.time}</Text>
                  <TouchableOpacity className="flex-row items-center">
                    <Text className="text-orange-500 text-xs font-medium mr-1">
                      Read More
                    </Text>
                    <Ionicons
                      name="chevron-forward"
                      size={12}
                      color="#f97316"
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Community Overview */}
        <View
          className="mx-5 mb-8 rounded-2xl p-6 overflow-hidden"
          style={{
            backgroundColor: "#ff8c37",
            shadowColor: "#ff8c37",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
          }}
        >
          <View className="flex-row items-center mb-4">
            <Text className="text-2xl font-bold text-white">
              Community Overview
            </Text>
            <Text className="text-2xl ml-2">🌟</Text>
          </View>

          <View className="flex-row justify-between">
            <View className="items-center bg-white/10 px-4 py-3 rounded-xl">
              <Text className="text-3xl font-bold text-white mb-1">4,027</Text>
              <View className="flex-row items-center">
                <Text className="text-white text-sm mr-1">👥</Text>
                <Text className="text-white text-sm">Total Members</Text>
              </View>
            </View>

            <View className="items-center bg-white/10 px-4 py-3 rounded-xl">
              <Text className="text-3xl font-bold text-white mb-1">2,069</Text>
              <View className="flex-row items-center">
                <Text className="text-white text-sm mr-1">👨</Text>
                <Text className="text-white text-sm">Males</Text>
              </View>
            </View>

            <View className="items-center bg-white/10 px-4 py-3 rounded-xl">
              <Text className="text-3xl font-bold text-white mb-1">1,958</Text>
              <View className="flex-row items-center">
                <Text className="text-white text-sm mr-1">👩</Text>
                <Text className="text-white text-sm">Females</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
