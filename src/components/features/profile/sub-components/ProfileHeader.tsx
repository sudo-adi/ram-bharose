import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
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
  return (
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
          <TouchableOpacity onPress={() => setIsEditing(true)} className="mt-1">
            <Text className="text-orange-500 font-medium">Edit Profile</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default ProfileHeader;
