import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { supabase } from "@/lib/supabase";
import { updateProfileDetails, uploadCoverImage } from "@/hooks/useSupabase";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect } from "react";
import React from "react";

// Import components
import ProfileHeader from "./sub-components/ProfileHeader";
import ProfileTabs from "./sub-components/ProfileTabs";
import PersonalInfoSection from "./sub-components/PersonalInfoSection";
import FamilyMembersSection from "./sub-components/FamilyMembersSection";

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
    <SafeAreaView className="flex-1 bg-white">
      {/* Sticky Header */}
      <View
        className="bg-white shadow-none px-5 pt-4 z-10"
        style={{ elevation: 4 }}
      >
        <ProfileHeader
          profileData={profileData}
          isEditing={isEditing}
          isUploading={isUploading}
          activeTab={activeTab}
          setProfileData={setProfileData}
          setIsEditing={setIsEditing}
          pickCoverImage={pickCoverImage}
        />

        <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </View>

      {/* Scrollable Content */}
      <ScrollView className="flex-1 bg-white px-5">
        {activeTab === "personal" ? (
          <PersonalInfoSection
            profileData={profileData}
            isEditing={isEditing}
            isLoggingOut={isLoggingOut}
            setIsEditing={setIsEditing}
            setProfileData={setProfileData}
            handleEditProfile={handleEditProfile}
            handleLogout={handleLogout}
          />
        ) : (
          <FamilyMembersSection familyMembers={familyMembers} />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
