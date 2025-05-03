import React, { useState } from "react";
import { supabase } from '@/lib/supabase';
import { useUser } from "@clerk/clerk-expo";

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  Image,
  KeyboardTypeOptions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { useFormSubmission } from '@/hooks/useSupabase';

export default function ApplicationForm() {
  const [activeTab, setActiveTab] = useState("event");

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="px-5 pt-14 pb-4">
        <Text className="text-2xl font-bold text-gray-800">
          Application Form
        </Text>
        <Text className="text-gray-500 mt-1">
          Submit your event or donation request
        </Text>
      </View>

      {/* Tab Navigation */}
      <View className="flex-row border-b border-gray-200 mx-4">
        <TouchableOpacity
          className={`flex-1 items-center py-3 border-b-2 ${activeTab === "event" ? "border-orange-500" : "border-transparent"
            }`}
          onPress={() => setActiveTab("event")}
        >
          <Text
            className={`font-medium ${activeTab === "event" ? "text-orange-500" : "text-gray-500"
              }`}
          >
            Event
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 items-center py-3 border-b-2 ${activeTab === "donation"
            ? "border-orange-500"
            : "border-transparent"
            }`}
          onPress={() => setActiveTab("donation")}
        >
          <Text
            className={`font-medium ${activeTab === "donation" ? "text-orange-500" : "text-gray-500"
              }`}
          >
            Donation
          </Text>
        </TouchableOpacity>
      </View>

      {/* Form Content */}
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "event" ? <EventForm /> : <DonationForm />}
      </ScrollView>
    </View>
  );
}

function ImageUploadCard({ onImageSelect, selectedImage }) {
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelect(result.assets[0]);
    }
  };

  return (
    <TouchableOpacity className="mb-6" onPress={pickImage}>
      <View className="h-32 w-full rounded-xl border-2 border-dashed border-gray-300 justify-center items-center bg-gray-50 overflow-hidden">
        {selectedImage ? (
          <Image
            source={{ uri: selectedImage.uri }}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          <>
            <Ionicons name="add" size={32} color="#9ca3af" />
            <Text className="text-gray-500 text-xs mt-2">Upload Image</Text>
          </>
        )}
      </View>
    </TouchableOpacity>
  );
}

function EventForm() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startTime: '',
    duration: '',
    organizers: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (!formData.startTime?.trim()) newErrors.startTime = 'Start time is required';
    if (!formData.duration?.trim()) newErrors.duration = 'Duration is required';
    if (!formData.organizers?.trim()) newErrors.organizers = 'Organizers are required';
    if (!formData.image) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { submitEvent, loading: submitting, error: submitError } = useFormSubmission();

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }
    const userEmail = user?.primaryEmailAddress?.emailAddress;
    const userId = await getUserIdByEmail(userEmail);

    const success = await submitEvent({
      userId,
      name: formData.name,
      description: formData.description,
      startTime: formData.startTime,
      duration: formData.duration,
      organizers: formData.organizers.split(',').map(org => org.trim()),
      image: formData.image
    });

    if (success) {
      Alert.alert('Success', 'Event submitted successfully');
      setFormData({
        name: '',
        description: '',
        startTime: '',
        duration: '',
        organizers: '',
        image: null
      });
    } else {
      Alert.alert('Error', submitError || 'Failed to submit event. Please try again.');
    }
  };

  return (
    <View className="pb-10">
      <Text className="text-lg font-semibold text-gray-800 mb-4">
        Event Details
      </Text>

      {/* Image Upload Card */}
      <ImageUploadCard
        onImageSelect={(file) => setFormData({ ...formData, image: file })}
        selectedImage={formData.image}
      />
      {errors.image && (
        <Text className="text-red-500 text-xs mb-4">{errors.image}</Text>
      )}

      <FormField
        label="Name"
        placeholder="Enter event name"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
        error={errors.name}
      />
      <FormField
        label="Description"
        placeholder="Enter event description"
        multiline={true}
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
        error={errors.description}
      />
      <FormField
        label="Start Time"
        placeholder="YYYY-MM-DD HH:MM"
        value={formData.startTime}
        onChangeText={(text) => setFormData({ ...formData, startTime: text })}
        error={errors.startTime}
      />
      <FormField
        label="Duration"
        placeholder="Enter duration (e.g., 2 hours)"
        value={formData.duration}
        onChangeText={(text) => setFormData({ ...formData, duration: text })}
        error={errors.duration}
      />
      <FormField
        label="Organizers"
        placeholder="Enter organizer names (comma separated)"
        value={formData.organizers}
        onChangeText={(text) => setFormData({ ...formData, organizers: text })}
        error={errors.organizers}
      />

      <TouchableOpacity
        className={`bg-orange-500 py-4 rounded-xl mt-6 ${loading ? 'opacity-50' : ''}`}
        onPress={handleSubmit}
        disabled={loading}>
        <Text className="text-white text-center font-semibold text-lg">
          {loading ? 'Submitting...' : 'Submit Event'}
        </Text>
      </TouchableOpacity>

      <View className="mt-4">
        <Text className="text-xs text-gray-500 text-center">
          Event submissions will be reviewed by administrators
        </Text>
      </View>
    </View>
  );
}

async function getUserIdByEmail(email: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error fetching user_id:', error);
    return null;
  }

  return data ? data.id : null;
}

function DonationForm() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    cause: '',
    openTill: '',
    image: null
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.amount) newErrors.amount = 'Amount is required';
    if (isNaN(Number(formData.amount))) newErrors.amount = 'Amount must be a number';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.cause) newErrors.cause = 'Cause is required';
    if (!formData.openTill) newErrors.openTill = 'Open till date is required';
    if (!formData.image) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const { submitDonation, loading: submitting, error: submitError } = useFormSubmission();

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    const userEmail = user?.primaryEmailAddress?.emailAddress;
    const userId = await getUserIdByEmail(userEmail);

    const success = await submitDonation({
      userId,
      amount: Number(formData.amount),
      description: formData.description,
      cause: formData.cause,
      openTill: formData.openTill,
      image: formData.image
    });

    if (success) {
      Alert.alert('Success', 'Donation request submitted successfully');
      setFormData({
        amount: '',
        description: '',
        cause: '',
        openTill: '',
        image: null
      });
    } else {
      Alert.alert('Error', submitError || 'Failed to submit donation request. Please try again.');
    }
  };

  return (
    <View className="pb-10">
      <Text className="text-lg font-semibold text-gray-800 mb-4">
        Donation Details
      </Text>

      {/* Image Upload Card */}
      <ImageUploadCard
        onImageSelect={(file) => setFormData({ ...formData, image: file })}
        selectedImage={formData.image}
      />
      {errors.image && (
        <Text className="text-red-500 text-xs mb-4">{errors.image}</Text>
      )}

      <FormField
        label="Amount"
        placeholder="Enter donation amount"
        keyboardType="numeric"
        value={formData.amount}
        onChangeText={(text) => setFormData({ ...formData, amount: text })}
        error={errors.amount}
      />
      <FormField
        label="Description"
        placeholder="Enter donation description"
        multiline={true}
        value={formData.description}
        onChangeText={(text) => setFormData({ ...formData, description: text })}
        error={errors.description}
      />
      <FormField
        label="Cause"
        placeholder="Enter donation cause"
        value={formData.cause}
        onChangeText={(text) => setFormData({ ...formData, cause: text })}
        error={errors.cause}
      />
      <FormField
        label="Open Till"
        placeholder="YYYY-MM-DD"
        value={formData.openTill}
        onChangeText={(text) => setFormData({ ...formData, openTill: text })}
        error={errors.openTill}
      />

      <TouchableOpacity
        className={`bg-orange-500 py-4 rounded-xl mt-6 ${loading ? 'opacity-50' : ''}`}
        onPress={handleSubmit}
        disabled={loading}>
        <Text className="text-white text-center font-semibold text-lg">
          {loading ? 'Submitting...' : 'Submit Donation'}
        </Text>
      </TouchableOpacity>

      <View className="mt-4">
        <Text className="text-xs text-gray-500 text-center">
          Donation requests will be reviewed by administrators
        </Text>
      </View>
    </View>
  );
}

function FormField({
  label,
  placeholder,
  multiline = false,
  keyboardType = "default",
  value,
  onChangeText,
  error
}) {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 mb-2">{label}</Text>
      <TextInput
        className={`border rounded-lg p-3 text-gray-800 bg-gray-50 ${error ? 'border-red-500' : 'border-gray-300'}`}
        placeholder={placeholder}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        style={multiline ? { height: 100, textAlignVertical: "top" } : {}}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType as KeyboardTypeOptions}
      />
      {error && (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      )}
    </View>
  );
}
