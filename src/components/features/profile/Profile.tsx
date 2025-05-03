import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { supabase } from "@/lib/supabase";

export default function ProfileContent() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userEmail = user?.emailAddresses[0]?.emailAddress;
        if (!userEmail) return;

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('email', userEmail)
          .single();

        if (error) throw error;

        if (profile) {
          setProfileData({
            name: `${profile.name}`,
            phone: profile.mobile_no1 || '',
            address: [
              profile.residential_address_line1,
              profile.residential_address_city,
              profile.residential_address_state
            ].filter(Boolean).join(', '),
            dateOfBirth: profile.date_of_birth || '',
            email: profile.email || '',
            profile_pic: profile.profile_pic,
            cover_pic: profile.family_cover_pic,
          });

          // Fetch family members
          const { data: members, error: membersError } = await supabase
            .from('profiles')
            .select('*')
            .eq('family_no', profile.family_no)
            .neq('email', userEmail);

          if (membersError) throw membersError;

          setFamilyMembers(members.map(member => ({
            id: member.id,
            name: member.name,
            relation: member.relationship,
            age: calculateAge(member.date_of_birth),
            gender: member.gender,
            image: member.profile_pic || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500',
          })));
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        alert('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    const calculateAge = (birthDate) => {
      if (!birthDate) return '';

      // Parse date in format "YY-MM-DD"
      const [year, month, day] = birthDate.split('-');

      // Create Date object
      const birth = new Date(
        parseInt(year),
        parseInt(month) - 1, // Months are 0-indexed in JS Date
        parseInt(day)
      );

      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();

      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }

      return `${age} years`;
    };

    fetchProfileData();
  }, [user]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      router.replace("/login");
    } catch (error) {
      console.error("Error signing out:", error);
      alert("Failed to sign out. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const ProfileField = ({ label, value, onEdit }) => (
    <View className="mb-4">
      <Text className="text-gray-400 text-sm mb-1">{label}</Text>
      <View className="flex-row items-center justify-between border-b border-gray-100 pb-2">
        <Text className="text-gray-800 text-base">{value}</Text>
        <TouchableOpacity onPress={onEdit}>
          <Ionicons name="pencil" size={18} color="#ff7e54" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#f97316" />
      </View>
    );
  }

  if (!profileData) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-gray-500">Failed to load profile data</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-5 pt-4 pb-20">
        {/* Profile Header */}
        <View className="mb-8">
          {/* Cover Image */}
          <View className="relative h-40 mb-12">
            <Image
              source={{
                uri: profileData.cover_pic || "https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=1000",
              }}
              className="w-full h-full rounded-xl"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-black/10 rounded-xl" />
            <TouchableOpacity className="absolute bottom-3 right-3 bg-black/30 px-3 py-2 rounded-lg flex-row items-center">
              <Ionicons name="camera-outline" size={18} color="white" />
              <Text className="text-white text-sm ml-1">Edit Cover</Text>
            </TouchableOpacity>

            {/* Profile Image */}
            <View className="absolute -bottom-10 left-5">
              <View className="relative">
                <Image
                  source={{
                    uri: profileData.profile_pic || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500",
                  }}
                  className="w-24 h-24 rounded-full border-4 border-white"
                />
                <TouchableOpacity
                  className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full"
                  style={{ elevation: 2 }}
                >
                  <Ionicons name="camera" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Name and Edit Profile */}
          <View className="ml-5">
            <Text className="text-xl font-bold">{profileData.name}</Text>
            <TouchableOpacity className="mt-1">
              <Text className="text-orange-500 font-medium">Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Tabs */}
        <View className="mb-6">
          <View className="flex-row border-b border-gray-100">
            <TouchableOpacity
              className={`flex-1 pb-3 ${!isEditing ? "border-b-2 border-orange-500" : ""
                }`}
              onPress={() => setIsEditing(false)}
            >
              <Text
                className={`text-center font-medium ${!isEditing ? "text-orange-500" : "text-gray-500"
                  }`}
              >
                Personal Info
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 pb-3 ${isEditing ? "border-b-2 border-orange-500" : ""
                }`}
              onPress={() => setIsEditing(true)}
            >
              <Text
                className={`text-center font-medium ${isEditing ? "text-orange-500" : "text-gray-500"
                  }`}
              >
                Family Members
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Conditional Rendering based on selected tab */}
        {!isEditing ? (
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              Personal Information
            </Text>

            <View className="flex flex-col gap-2">
              <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <View className="flex-row items-center mb-2">
                  <View className="bg-blue-100 p-2 rounded-full">
                    <Ionicons name="call-outline" size={20} color="#3b82f6" />
                  </View>
                  <Text className="text-gray-400 text-sm ml-3">Phone</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-800 text-base">
                    {profileData.phone}
                  </Text>
                  <TouchableOpacity>
                    <Ionicons name="pencil" size={18} color="#ff7e54" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <View className="flex-row items-center mb-2">
                  <View className="bg-green-100 p-2 rounded-full">
                    <Ionicons
                      name="location-outline"
                      size={20}
                      color="#10b981"
                    />
                  </View>
                  <Text className="text-gray-400 text-sm ml-3">Address</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-800 text-base">
                    {profileData.address}
                  </Text>
                  <TouchableOpacity>
                    <Ionicons name="pencil" size={18} color="#ff7e54" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <View className="flex-row items-center mb-2">
                  <View className="bg-purple-100 p-2 rounded-full">
                    <Ionicons
                      name="calendar-outline"
                      size={20}
                      color="#8b5cf6"
                    />
                  </View>
                  <Text className="text-gray-400 text-sm ml-3">
                    Date of Birth
                  </Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-800 text-base">
                    {profileData.dateOfBirth ? new Date(profileData.dateOfBirth).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    }) : 'Not set'}
                  </Text>
                  <TouchableOpacity>
                    <Ionicons name="pencil" size={18} color="#ff7e54" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <View className="flex-row items-center mb-2">
                  <View className="bg-orange-100 p-2 rounded-full">
                    <Ionicons name="mail-outline" size={20} color="#f97316" />
                  </View>
                  <Text className="text-gray-400 text-sm ml-3">Email</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  <Text className="text-gray-800 text-base">
                    {profileData.email}
                  </Text>
                  <TouchableOpacity>
                    <Ionicons name="pencil" size={18} color="#ff7e54" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ) : (
          <View className="mb-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">
                Family Members
              </Text>
              <TouchableOpacity>
                <Text className="text-orange-500 font-medium">Add New</Text>
              </TouchableOpacity>
            </View>

            {familyMembers.map((member) => (
              <View
                key={member.id}
                className="flex-row items-center justify-between bg-white rounded-xl p-3 mb-3 border border-gray-100"
              >
                <View className="flex-row items-center flex-1">
                  <Image
                    source={{ uri: member.image }}
                    className="w-12 h-12 rounded-full"
                  />
                  <View className="ml-3 flex-1">
                    <Text className="font-semibold text-gray-800">
                      {member.name}
                    </Text>
                    <Text className="text-gray-500 text-sm">
                      {member.relation} • {member.age}
                    </Text>
                    <Text className="text-gray-400 text-xs">
                      {member.gender}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center">
                  <TouchableOpacity className="mr-3">
                    <Ionicons name="create-outline" size={20} color="#666" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Logout Button */}
        {isLoggingOut ? (
          <View className="flex-row justify-center items-center">
            <ActivityIndicator size="large" color="#f97316" />
          </View>
        ) :
          (
            <TouchableOpacity
              className="bg-red-500 py-3.5 rounded-xl items-center"
              onPress={handleLogout}
            >
              <Text className="text-white font-medium">Logout</Text>
            </TouchableOpacity>
          )
        }
      </View >
    </ScrollView >
  );
}