import Businesses from "@/components/features/businessess/page";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Modal, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { supabase } from "@/lib/supabase";
import AsyncStorage from "@react-native-async-storage/async-storage";


const CATEGORIES = [
  "Retail",
  "Services",
  "Food & Beverage",
  "Healthcare",
  "Education",
  "Technology",
  "Other"
];

const getUserIdByPhone = async (phone: string | null) => {
  if (!phone) return null;

  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("mobile_no1", phone) // Changed 'phone' to 'mobile_no1'
      .single();

    if (error) {
      // If user doesn't exist, return null as per new requirement
      // Do not create a new profile here
      console.error("Error fetching user ID or user not found:", error);
      return null;
    }
    return data.id;
  } catch (error) {
    console.error("Error getting user ID:", error);
    return null;
  }
};


export default function BusinessesPage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: CATEGORIES[0],
    description: "",
    location: "",
    contact_email: "",
    contact_phone: "",
    website: "",
  });

  const handleSubmit = async () => {
    try {
      const userPhone = await AsyncStorage.getItem("userPhone");
      const userId = await getUserIdByPhone(userPhone);

      if (!userId) {
        Alert.alert("Error", "User not found. Please login again.");
        return;
      }
      const { data, error } = await supabase
        .from("nari_sahas_applications")
        .insert([
          {
            ...formData,
            user_id: userId
          },
        ])
        .select();

      if (error) throw error;
      Alert.alert("Success", "Business added successfully!");
      setShowForm(false);
      setFormData({
        name: "",
        category: CATEGORIES[0],
        description: "",
        location: "",
        contact_email: "",
        contact_phone: "",
        website: "",
      });
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Nari Sahas",
          headerTintColor: "#CD497D",
          presentation: "card",
          headerBackTitle: "Explore",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => setShowForm(true)}
              className="mr-4"
            >
              <Ionicons name="add-circle-outline" size={24} color="#CD497D" />
            </TouchableOpacity>
          ),
        }}
      />
      <SafeAreaView className="flex-1 bg-white">
        <Businesses />

        <Modal
          visible={showForm}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setShowForm(false)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <View className="bg-white rounded-t-3xl p-6 h-[90%]">
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-bold text-gray-800">Add Business</Text>
                <TouchableOpacity onPress={() => setShowForm(false)}>
                  <Ionicons name="close-circle-outline" size={24} color="#64748b" />
                </TouchableOpacity>
              </View>

              <ScrollView className="flex-1">
                <View className="space-y-4">
                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-1">Business Name</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg p-3 text-gray-700"
                      value={formData.name}
                      onChangeText={(text) => setFormData({ ...formData, name: text })}
                      placeholder="Enter business name"
                    />
                  </View>

                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-1">Category</Text>
                    <View className="border border-gray-300 rounded-lg p-3">
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {CATEGORIES.map((category) => (
                          <TouchableOpacity
                            key={category}
                            onPress={() => setFormData({ ...formData, category })}
                            className={`px-4 py-2 rounded-full mr-2 ${formData.category === category ? 'bg-[#CD497D]' : 'bg-gray-200'}`}
                          >
                            <Text className={`${formData.category === category ? 'text-white' : 'text-gray-700'}`}>
                              {category}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                    </View>
                  </View>

                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-1">Description</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg p-3 text-gray-700"
                      value={formData.description}
                      onChangeText={(text) => setFormData({ ...formData, description: text })}
                      placeholder="Enter business description"
                      multiline
                      numberOfLines={4}
                      textAlignVertical="top"
                    />
                  </View>

                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-1">Location</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg p-3 text-gray-700"
                      value={formData.location}
                      onChangeText={(text) => setFormData({ ...formData, location: text })}
                      placeholder="Enter business location"
                    />
                  </View>

                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-1">Contact Email</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg p-3 text-gray-700"
                      value={formData.contact_email}
                      onChangeText={(text) => setFormData({ ...formData, contact_email: text })}
                      placeholder="Enter contact email"
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                  </View>

                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-1">Contact Phone</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg p-3 text-gray-700"
                      value={formData.contact_phone}
                      onChangeText={(text) => setFormData({ ...formData, contact_phone: text })}
                      placeholder="Enter contact phone"
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View>
                    <Text className="text-sm font-medium text-gray-700 mb-1">Website</Text>
                    <TextInput
                      className="border border-gray-300 rounded-lg p-3 text-gray-700"
                      value={formData.website}
                      onChangeText={(text) => setFormData({ ...formData, website: text })}
                      placeholder="Enter website URL"
                      keyboardType="url"
                      autoCapitalize="none"
                    />
                  </View>
                </View>
              </ScrollView>

              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-[#CD497D] rounded-lg py-4 mt-6"
              >
                <Text className="text-white text-center font-semibold text-lg">Submit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </>
  );
}
