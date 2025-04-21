import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function SignUpScreen() {
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = () => {
    // Here you would typically validate and register
    // For now, we'll just navigate to the home screen
    router.replace("/");
  };

  const navigateToLogin = () => {
    router.push("/login");
  };

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 py-10">
        {/* Tab Navigation */}
        <View className="flex-row mb-8">
          <TouchableOpacity className="pb-2 mr-4" onPress={navigateToLogin}>
            <Text className="text-gray-400 font-medium text-base">Login</Text>
          </TouchableOpacity>
          <TouchableOpacity className="pb-2 border-b-2 border-orange-400">
            <Text className="text-orange-400 font-medium text-base">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logo */}
        <View className="items-center mb-8">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=250",
            }}
            className="w-[180px] h-[180px] rounded-lg"
          />
        </View>

        {/* Welcome Text */}
        <Text className="text-2xl font-bold text-center text-gray-800 mb-2">
          Join KMS Connect
        </Text>
        <Text className="text-gray-500 text-center mb-8">
          Create an account to get started
        </Text>

        {/* Form */}
        <View className="mb-4">
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className="mb-4">
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700"
            placeholder="Enter your phone number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        <View className="mb-4 relative">
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 pr-12"
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            className="absolute right-3 top-3"
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        <View className="mb-6 relative">
          <TextInput
            className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 pr-12"
            placeholder="Confirm password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity
            className="absolute right-3 top-3"
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="#999"
            />
          </TouchableOpacity>
        </View>

        {/* Sign Up Button */}
        <TouchableOpacity
          className="bg-orange-400 rounded-lg py-3 items-center mb-8"
          onPress={handleSignUp}
        >
          <Text className="text-white font-medium text-base">Sign Up</Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View className="flex-row justify-center">
          <Text className="text-gray-600">Already have an account?</Text>
          <TouchableOpacity onPress={navigateToLogin}>
            <Text className="text-orange-400 font-medium ml-1">Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
