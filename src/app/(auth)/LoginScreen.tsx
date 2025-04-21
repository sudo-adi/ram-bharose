import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    router.replace("/");
  };

  const handleOTPLogin = () => {
    router.replace("/");
  };

  const navigateToSignUp = () => {
    router.push("/signup");
  };

  return (
    <View className="flex-1 bg-white px-6 justify-center">
      {/* Tab Navigation */}
      <View className="flex-row mb-8">
        <TouchableOpacity className="pb-2 border-b-2 border-orange-400 mr-4">
          <Text className="text-orange-400 font-medium text-base">Login</Text>
        </TouchableOpacity>
        <TouchableOpacity className="pb-2" onPress={navigateToSignUp}>
          <Text className="text-gray-400 font-medium text-base">Sign Up</Text>
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
        Welcome Back to KMS Connect
      </Text>
      <Text className="text-gray-500 text-center mb-8">
        Sign in to continue
      </Text>

      {/* Form */}
      <View className="mb-4">
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700"
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
        />
      </View>

      <View className="mb-2 relative">
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-3 text-gray-700 pr-12"
          placeholder="Enter your password"
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

      <TouchableOpacity className="self-end mb-6">
        <Text className="text-orange-400">Forgot Password?</Text>
      </TouchableOpacity>

      {/* Login Button */}
      <TouchableOpacity
        className="bg-orange-400 rounded-lg py-3 items-center mb-4"
        onPress={handleLogin}
      >
        <Text className="text-white font-medium text-base">Login</Text>
      </TouchableOpacity>

      {/* OR Divider */}
      <View className="flex-row items-center mb-4">
        <View className="flex-1 h-[1px] bg-gray-200" />
        <Text className="mx-4 text-gray-500">OR</Text>
        <View className="flex-1 h-[1px] bg-gray-200" />
      </View>

      {/* OTP Button */}
      <TouchableOpacity
        className="border border-orange-400 rounded-lg py-3 items-center mb-8"
        onPress={handleOTPLogin}
      >
        <Text className="text-orange-400 font-medium text-base">
          Continue with OTP
        </Text>
      </TouchableOpacity>

      {/* Sign Up Link */}
      <View className="flex-row justify-center">
        <Text className="text-gray-600">New to KMS Connect?</Text>
        <TouchableOpacity onPress={navigateToSignUp}>
          <Text className="text-orange-400 font-medium ml-1">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
