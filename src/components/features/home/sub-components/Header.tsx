import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import React from "react";

type HeaderProps = {
  userName: string;
  getGreeting: () => string;
};

const Header = ({ userName, getGreeting }: HeaderProps) => {
  const [showDetailedStats, setShowDetailedStats] = useState(false);
  // Create animated value for rotation
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Toggle function with animation
  const toggleStats = () => {
    // Animate rotation
    Animated.timing(rotateAnim, {
      toValue: showDetailedStats ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Toggle state
    setShowDetailedStats(!showDetailedStats);
  };

  // Create interpolated rotation value
  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View
      className="pt-8 pb-4 px-5 rounded-b-3xl shadow-lg"
      style={{
        backgroundColor: "#ff8c37",
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
      }}
    >
      {/* Top row with greeting and stats summary */}
      <View className="flex-row justify-between items-center mb-4">
        <View className="flex-1">
          <Text className="text-white text-xs opacity-90">
            {getGreeting()} ☀️
          </Text>
          <Text className="text-xl font-bold text-white">
            Namaste, {userName}
          </Text>
        </View>

        {/* Compact Stats Bar */}
        <View className="flex-row items-center bg-white/20 rounded-full px-3 py-1">
          <Text className="text-white text-xs mr-2">4,027</Text>
          <Ionicons name="people-outline" size={16} color="white" />
          <TouchableOpacity
            className="ml-2"
            onPress={toggleStats}
            activeOpacity={0.7}
          >
            <Animated.View style={{ transform: [{ rotate: rotation }] }}>
              <Ionicons name="chevron-down" size={16} color="white" />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Wide Search Bar */}
      <View className="flex-row items-center mb-4">
        <View className="flex-1 bg-white/20 rounded-full flex-row items-center px-3 py-2">
          <Ionicons name="search-outline" size={18} color="white" />
          <TextInput
            placeholder="Search..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            className="flex-1 ml-2 text-white"
          />
        </View>
      </View>

      {/* Expandable Detailed Community Stats */}
      {showDetailedStats && (
        <View className="flex-row justify-between bg-white/15 p-3 rounded-2xl">
          <View className="items-center">
            <Text className="text-lg font-bold text-white">4,027</Text>
            <Text className="text-white text-xs">Total Members</Text>
          </View>
          <View className="h-full w-px bg-white/20" />
          <View className="items-center">
            <Text className="text-lg font-bold text-white">2,069</Text>
            <Text className="text-white text-xs">Males</Text>
          </View>
          <View className="h-full w-px bg-white/20" />
          <View className="items-center">
            <Text className="text-lg font-bold text-white">1,958</Text>
            <Text className="text-white text-xs">Females</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default Header;
