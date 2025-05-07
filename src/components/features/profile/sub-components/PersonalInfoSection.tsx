import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PersonalInfoItem from "./PersonalInfoItem";

interface PersonalInfoSectionProps {
  profileData: any;
  isEditing: boolean;
  isLoggingOut: boolean;
  setIsEditing: (editing: boolean) => void;
  setProfileData: (data: any) => void;
  handleEditProfile: () => void;
  handleLogout: () => void;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  profileData,
  isEditing,
  isLoggingOut,
  setIsEditing,
  setProfileData,
  handleEditProfile,
  handleLogout,
}) => {
  return (
    <View className="mb-6">
      <Text className="text-xl font-bold text-gray-800 mb-4">
        Personal Information
      </Text>

      <View className="flex flex-col gap-2">
        <PersonalInfoItem
          icon="person-outline"
          iconColor="#ef4444"
          bgColor="bg-red-100"
          label="Name"
          value={profileData.name}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onChangeText={(text) =>
            setProfileData({ ...profileData, name: text })
          }
        />

        <PersonalInfoItem
          icon="call-outline"
          iconColor="#3b82f6"
          bgColor="bg-blue-100"
          label="Phone"
          value={profileData.phone}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onChangeText={(text) =>
            setProfileData({ ...profileData, phone: text })
          }
        />

        <PersonalInfoItem
          icon="location-outline"
          iconColor="#10b981"
          bgColor="bg-green-100"
          label="Address"
          value={profileData.address}
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onChangeText={(text) =>
            setProfileData({ ...profileData, address: text })
          }
        />

        <PersonalInfoItem
          icon="calendar-outline"
          iconColor="#8b5cf6"
          bgColor="bg-purple-100"
          label="Date of Birth"
          value={
            profileData.dateOfBirth
              ? new Date(profileData.dateOfBirth).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })
              : "Not set"
          }
          isEditing={isEditing}
          onEdit={() => setIsEditing(true)}
          onChangeText={(text) =>
            setProfileData({ ...profileData, dateOfBirth: text })
          }
        />

        <PersonalInfoItem
          icon="mail-outline"
          iconColor="#f97316"
          bgColor="bg-orange-100"
          label="Email"
          value={profileData.email}
          isEditing={isEditing}
          editable={false}
        />
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

      {/* Logout Button */}
      <TouchableOpacity
        className="mt-8 bg-red-500 py-3 rounded-xl flex-row justify-center items-center"
        onPress={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut ? (
          <ActivityIndicator size="small" color="white" />
        ) : (
          <>
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text className="text-white font-medium ml-2">Logout</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default PersonalInfoSection;