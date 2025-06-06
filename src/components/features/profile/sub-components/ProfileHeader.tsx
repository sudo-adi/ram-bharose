import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Modal,
  ScrollView,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ProfileHeaderProps {
  profileData: any;
  isEditing: boolean;
  isUploading: boolean;
  activeTab: string;
  setProfileData: (data: any) => void;
  setIsEditing: (editing: boolean) => void;
  pickCoverImage: (bucket: string) => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profileData,
  isEditing,
  isUploading,
  activeTab,
  setProfileData,
  setIsEditing,
  pickCoverImage,
}) => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  const handlePrivacyPolicy = () => {
    // Open privacy policy URL in browser
    Linking.openURL("https://kmmms.org/privacy-policy").catch((err) => {
      console.error("Error opening privacy policy URL:", err);
    });
    setShowInfoModal(false);
  };

  return (
    <>
      <View className="mb-8 shadow-none">
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
        <View className="ml-5 flex-row items-center justify-between pr-5">
          <View className="flex-1">
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

          {/* Info Button */}
          <TouchableOpacity
            className="bg-gray-100 p-2 rounded-full"
            onPress={() => setShowInfoModal(true)}
          >
            <Ionicons
              name="information-circle-outline"
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Info Modal */}
      <Modal
        visible={showInfoModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowInfoModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl">
            {/* Modal Header */}
            <View className="items-center mb-6">
              <View className="bg-orange-100 p-3 rounded-full mb-3">
                <Ionicons name="information-circle" size={32} color="#f97316" />
              </View>
              <Text className="text-2xl font-bold text-gray-800">App Info</Text>
            </View>

            {/* App Info Content */}
            <View className="items-center mb-8">
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                Family Connect
              </Text>
              <Text className="text-sm text-gray-500 mb-4">Version 1.0.0</Text>

              <Text className="text-sm text-gray-600 text-center leading-6">
                Stay connected with your family members, share precious moments,
                and keep everyone updated with the latest family news and
                activities.
              </Text>
            </View>

            {/* Modal Buttons */}
            <View className="space-y-3">
              <TouchableOpacity
                onPress={handlePrivacyPolicy}
                className="bg-orange-500 py-4 rounded-xl shadow-sm"
              >
                <Text className="text-white text-center font-semibold text-base">
                  Privacy Policy
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowInfoModal(false)}
                className="bg-gray-50 py-4 rounded-xl border border-gray-200"
              >
                <Text className="text-gray-600 text-center font-medium text-base">
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ProfileHeader;
