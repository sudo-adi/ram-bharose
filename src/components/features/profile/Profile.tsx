import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { supabase } from "@/lib/supabase";
import { updateProfileDetails, uploadCoverImage } from "@/hooks/useSupabase";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import React from "react";

export default function ProfileContent() {
  const { signOut } = useAuth();
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const userEmail = user?.emailAddresses[0]?.emailAddress;
        if (!userEmail) return;

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", userEmail)
          .single();

        if (error) throw error;

        if (profile) {
          setUserId(profile.id); // Store user ID for later use

          // Fetch cover image URL from Supabase storage
          let coverPicUrl =
            "https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=1000"; // Default placeholder
          let profilePicUrl =
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500"; // Default placeholder

          if (profile.profile_pic) {
            const { data: profileImageData } = await supabase.storage
              .from("profile-pictures")
              .getPublicUrl(profile.profile_pic);

            if (profileImageData?.publicUrl) {
              profilePicUrl = profileImageData.publicUrl;
            }
          }

          if (profile.family_cover_pic) {
            const { data: coverImageData } = await supabase.storage
              .from("family-cover-images")
              .getPublicUrl(profile.family_cover_pic);

            if (coverImageData?.publicUrl) {
              coverPicUrl = coverImageData.publicUrl;
            }
          }

          setProfileData({
            name: `${profile.name}`,
            phone: profile.mobile_no1 || "",
            address: [
              profile.residential_address_line1,
              profile.residential_address_city,
              profile.residential_address_state,
            ]
              .filter(Boolean)
              .join(","),
            dateOfBirth: profile.date_of_birth || "",
            email: profile.email || "",
            profile_pic: profilePicUrl,
            cover_pic: coverPicUrl,
          });

          // Fetch family members based on email domain
          const emailParts = userEmail.split('@');
          const emailDomain = emailParts[1];

          // Fetch family members based on family_no instead of email domain
          const { data: members, error: membersError } = await supabase
            .from("profiles")
            .select("*")
            .eq("family_no", profile.family_no);

          if (membersError) throw membersError;

          setFamilyMembers(
            members.map((member) => ({
              id: member.id,
              name: member.name,
              relation: member.relationship,
              age: calculateAge(member.date_of_birth),
              gender: member.gender,
              image:
                (member.profile_pic ? supabase.storage.from("profile-pictures").getPublicUrl(member.profile_pic).data?.publicUrl : null) ||
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500",
            }))
          );
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        alert("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    const calculateAge = (birthDate) => {
      if (!birthDate) return "";

      // Parse date in format "YY-MM-DD"
      const [year, month, day] = birthDate.split("-");

      // Create Date object
      const birth = new Date(
        parseInt(year),
        parseInt(month) - 1, // Months are 0-indexed in JS Date
        parseInt(day)
      );

      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();

      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birth.getDate())
      ) {
        age--;
      }

      return `${age} years`;
    };

    fetchProfileData();
  }, [user]);

  // Add image picker function
  const pickCoverImage = async (bucket: string) => {
    try {
      // Request permissions
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please allow access to your photo library to change your cover image."
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];
        uploadCoverImageToSupabase(selectedImage.uri, bucket);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  // Function to upload the selected image
  const uploadCoverImageToSupabase = async (imageUri, bucket) => {
    if (!userId) {
      Alert.alert("Error", "User ID not found. Please try again later.");
      return;
    }

    setIsUploading(true);

    try {
      const { success, error, publicUrl } = await uploadCoverImage(
        userId,
        imageUri,
        bucket
      );

      if (success && publicUrl) {
        // Update local state with new image URL
        if (bucket === "family-cover-images") {
          setProfileData((prev) => ({
            ...prev,
            cover_pic: publicUrl,
          }));
          Alert.alert("Success", "Cover image updated successfully!");
        }
        if (bucket === "profile-pictures") {
          setProfileData((prev) => ({
            ...prev,
            profile_pic: publicUrl,
          }));
          Alert.alert("Success", "Profile image updated successfully!");
        }
      } else {
        throw error || new Error("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading cover image:", error);
      Alert.alert("Error", "Failed to upload cover image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

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

  const handleEditProfile = async () => {
    const userEmail = user?.emailAddresses[0]?.emailAddress;
    if (!userEmail) return;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("email", userEmail)
      .single();

    if (error) throw error;

    const userId = profile?.id;
    if (!userId) return;

    try {
      // Handle address splitting logic
      const addressParts = profileData.address.split(",");
      let addressLine1 = "";
      let addressCity = "";
      let addressState = "";

      if (addressParts.length === 1) {
        // If only one part, treat it as state
        addressState = addressParts[0];
      } else if (addressParts.length === 2) {
        // If two parts, treat as city and state
        addressCity = addressParts[0];
        addressState = addressParts[1];
      } else if (addressParts.length >= 3) {
        // If three or more parts, use first three as line1, city, state
        addressLine1 = addressParts[0];
        addressCity = addressParts[1];
        addressState = addressParts[2];
      }

      const { success, error } = await updateProfileDetails(
        userId,
        profileData.name,
        profileData.phone,
        addressLine1,
        addressCity,
        addressState,
        profileData.dateOfBirth
      );

      if (!success) throw error;

      alert("Profile updated successfully");
      setIsEditing(false); // Exit edit mode after successful update
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile. Please try again.");
    }
  };

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
                uri:
                  profileData.cover_pic ||
                  "https://images.unsplash.com/photo-1609220136736-443140cffec6?q=80&w=1000",
              }}
              className="w-full h-full rounded-xl"
              resizeMode="cover"
            />
            {/* <View className="absolute inset-0 bg-black/10 rounded-xl" /> */}
            {isUploading ? (
              <View className="absolute bottom-3 right-3 bg-black/50 px-3 py-2 rounded-lg flex-row items-center">
                <ActivityIndicator size="small" color="white" />
                <Text className="text-white text-sm ml-2">Uploading...</Text>
              </View>
            ) : (
              <TouchableOpacity
                className="absolute bottom-3 right-3 bg-black/30 px-3 py-2 rounded-lg flex-row items-center"
                onPress={() => pickCoverImage("family-cover-images")}
              >
                <Ionicons name="camera-outline" size={18} color="white" />
                <Text className="text-white text-sm ml-1">Edit Cover</Text>
              </TouchableOpacity>
            )}

            {/* Profile Image */}
            <View className="absolute -bottom-10 left-5">
              <View className="relative">
                <Image
                  source={{
                    uri:
                      profileData.profile_pic ||
                      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500",
                  }}
                  className="w-24 h-24 rounded-full border-4 border-white"
                />
                <TouchableOpacity
                  className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full"
                  style={{ elevation: 2 }}
                  onPress={() => pickCoverImage("profile-pictures")}
                >
                  <Ionicons name="camera" size={16} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Name and Edit Profile */}
          <View className="ml-5">
            {isEditing ? (
              <TextInput
                value={profileData.name}
                onChangeText={(text) =>
                  setProfileData({ ...profileData, name: text })
                }
                className="text-xl font-bold"
              />
            ) : (
              <Text className="text-xl font-bold">{profileData.name}</Text>
            )}
            {activeTab === "personal" && !isEditing && (
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className="mt-1"
              >
                <Text className="text-orange-500 font-medium">
                  Edit Profile
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Profile Tabs */}
        <View className="mb-6">
          <View className="flex-row border-b border-gray-100">
            <TouchableOpacity
              className={`flex-1 pb-3 ${activeTab === "personal" ? "border-b-2 border-orange-500" : ""
                }`}
              onPress={() => setActiveTab("personal")}
            >
              <Text
                className={`text-center font-medium ${activeTab === "personal" ? "text-orange-500" : "text-gray-500"
                  }`}
              >
                Personal Info
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 pb-3 ${activeTab === "family" ? "border-b-2 border-orange-500" : ""
                }`}
              onPress={() => setActiveTab("family")}
            >
              <Text
                className={`text-center font-medium ${activeTab === "family" ? "text-orange-500" : "text-gray-500"
                  }`}
              >
                Family Members
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Conditional Rendering based on selected tab */}
        {activeTab === "personal" ? (
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              Personal Information
            </Text>

            <View className="flex flex-col gap-2">
              <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <View className="flex-row items-center mb-2">
                  <View className="bg-red-100 p-2 rounded-full">
                    <Ionicons name="person-outline" size={20} color="#ef4444" />
                  </View>
                  <Text className="text-gray-400 text-sm ml-3">Name</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  {isEditing ? (
                    <TextInput
                      value={profileData.name}
                      onChangeText={(text) =>
                        setProfileData({ ...profileData, name: text })
                      }
                      className="flex-1 text-gray-800 text-base"
                    />
                  ) : (
                    <Text className="text-gray-800 text-base">
                      {profileData.name}
                    </Text>
                  )}
                  <TouchableOpacity onPress={() => setIsEditing(true)}>
                    <Ionicons name="pencil" size={18} color="#ff7e54" />
                  </TouchableOpacity>
                </View>
              </View>

              <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <View className="flex-row items-center mb-2">
                  <View className="bg-blue-100 p-2 rounded-full">
                    <Ionicons name="call-outline" size={20} color="#3b82f6" />
                  </View>
                  <Text className="text-gray-400 text-sm ml-3">Phone</Text>
                </View>
                <View className="flex-row items-center justify-between">
                  {isEditing ? (
                    <TextInput
                      value={profileData.phone}
                      onChangeText={(text) =>
                        setProfileData({ ...profileData, phone: text })
                      }
                      className="flex-1 text-gray-800 text-base"
                    />
                  ) : (
                    <Text className="text-gray-800 text-base">
                      {profileData.phone}
                    </Text>
                  )}
                  <TouchableOpacity onPress={() => setIsEditing(true)}>
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
                  {isEditing ? (
                    <TextInput
                      value={profileData.address}
                      onChangeText={(text) =>
                        setProfileData({ ...profileData, address: text })
                      }
                      className="flex-1 text-gray-800 text-base"
                    />
                  ) : (
                    <Text className="text-gray-800 text-base">
                      {profileData.address}
                    </Text>
                  )}
                  <TouchableOpacity onPress={() => setIsEditing(true)}>
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
                  {isEditing ? (
                    <TextInput
                      value={profileData.dateOfBirth}
                      onChangeText={(text) =>
                        setProfileData({ ...profileData, dateOfBirth: text })
                      }
                      className="flex-1 text-gray-800 text-base"
                    />
                  ) : (
                    <Text className="text-gray-800 text-base">
                      {profileData.dateOfBirth
                        ? new Date(profileData.dateOfBirth).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                        : "Not set"}
                    </Text>
                  )}
                  <TouchableOpacity onPress={() => setIsEditing(true)}>
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
                  {/* No edit button for email */}
                </View>
              </View>
            </View>

            {/* Add Save/Cancel buttons when in edit mode */}
            {isEditing && (
              <View className="flex-row justify-between mt-4">
                <TouchableOpacity
                  className="bg-gray-300 py-2 px-4 rounded-lg"
                  onPress={() => setIsEditing(false)}
                >
                  <Text className="text-gray-700 font-medium">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-orange-500 py-2 px-4 rounded-lg"
                  onPress={handleEditProfile}
                >
                  <Text className="text-white font-medium">Save Changes</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          // Family Members tab content remains unchanged
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
                      {member.relationship} • {member.age}
                    </Text>
                    <Text className="text-gray-400 text-xs">
                      {member.gender}
                    </Text>
                  </View>
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
        ) : (
          <TouchableOpacity
            className="bg-red-500 py-3.5 rounded-xl items-center"
            onPress={handleLogout}
          >
            <Text className="text-white font-medium">Logout</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
