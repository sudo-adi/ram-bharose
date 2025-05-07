import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({
  activeTab,
  setActiveTab,
}) => {
  return (
    <View className="mb-6">
      <View className="flex-row border-b border-gray-100">
        <TouchableOpacity
          className={`flex-1 pb-3 ${
            activeTab === "personal" ? "border-b-2 border-orange-500" : ""
          }`}
          onPress={() => setActiveTab("personal")}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "personal" ? "text-orange-500" : "text-gray-500"
            }`}
          >
            Personal Info
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 pb-3 ${
            activeTab === "family" ? "border-b-2 border-orange-500" : ""
          }`}
          onPress={() => setActiveTab("family")}
        >
          <Text
            className={`text-center font-medium ${
              activeTab === "family" ? "text-orange-500" : "text-gray-500"
            }`}
          >
            Family Members
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileTabs;
