import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert
} from "react-native";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [phone, setPhone] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // Generate arrays for dropdown options
  const days = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    return day < 10 ? `0${day}` : day.toString();
  });
  const months = [
    { label: "January", value: "01" },
    { label: "February", value: "02" },
    { label: "March", value: "03" },
    { label: "April", value: "04" },
    { label: "May", value: "05" },
    { label: "June", value: "06" },
    { label: "July", value: "07" },
    { label: "August", value: "08" },
    { label: "September", value: "09" },
    { label: "October", value: "10" },
    { label: "November", value: "11" },
    { label: "December", value: "12" }
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => (currentYear - i).toString());

  const onPress = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!phone || !day || !month || !year) {
        Alert.alert("Error", "Please fill in all fields");
        return;
      }

      // Format date as YYYY-MM-DD
      const formattedDate = `${year}-${month}-${day}`;
      console.log(formattedDate);

      // Check if user exists in profiles
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("mobile_no1", phone)
        .eq("date_of_birth", formattedDate)
        .single();

      if (error) {
        Alert.alert("Error", "Invalid credentials");
        return;
      }

      if (profile) {
        // Store the phone number in AsyncStorage before redirecting
        await AsyncStorage.setItem('userPhone', phone);
        router.replace("/(tabs)");
      } else {
        Alert.alert("Error", "User not found");
      }

    } catch (err) {
      console.error("Login error:", err);
      setError("Failed to login. Please try again.");
      Alert.alert("Login Error", "There was a problem logging in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <View className="items-center mb-12">
        <Image
          source={require("@/assets/icon.png")}
          className="w-32 h-32"
          resizeMode="contain"
        />
        <Text className="text-2xl font-bold text-gray-800 mt-6">
          Welcome to KMS
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          Connect with your community and stay updated with family events
        </Text>
      </View>

      <View className="gap-10">
        <TextInput
          className="bg-gray-100 p-4"
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        <View className="flex-row space-x-2">
          <View className="flex-1">
            <Picker
              selectedValue={day}
              onValueChange={setDay}
              style={{ backgroundColor: '#f3f4f6', borderRadius: 12 }}>
              <Picker.Item label="Day" value="" />
              {days.map(d => (
                <Picker.Item key={d} label={d} value={d} />
              ))}
            </Picker>
          </View>

          <View className="flex-1">
            <Picker
              selectedValue={month}
              onValueChange={setMonth}
              style={{ backgroundColor: '#f3f4f6', borderRadius: 12 }}>
              <Picker.Item label="Month" value="" />
              {months.map(m => (
                <Picker.Item key={m.value} label={m.label} value={m.value} />
              ))}
            </Picker>
          </View>

          <View className="flex-1">
            <Picker
              selectedValue={year}
              onValueChange={setYear}
              style={{ backgroundColor: '#f3f4f6', borderRadius: 12 }}>
              <Picker.Item label="Year" value="" />
              {years.map(y => (
                <Picker.Item key={y} label={y} value={y} />
              ))}
            </Picker>
          </View>
        </View>
      </View>

      {isLoading ? (
        <View className="flex-row justify-center items-center mt-6">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : (
        <TouchableOpacity
          onPress={onPress}
          className="bg-orange-500 py-4 rounded-xl flex-row justify-center items-center mt-6"
        >
          <Text className="text-white font-semibold text-lg">
            Login
          </Text>
        </TouchableOpacity>
      )}

      {error && (
        <Text className="text-red-500 text-center mt-4">{error}</Text>
      )}
    </View>
  );
}
