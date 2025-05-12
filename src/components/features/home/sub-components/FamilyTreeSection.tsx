import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FamilyTreeItem {
  name: string;
  link: string;
  image_link: string;
  description?: string;
}

interface FamilyTreeSectionProps {
  familyTree: FamilyTreeItem[];
}

const FamilyTreeSection: React.FC<FamilyTreeSectionProps> = ({
  familyTree,
}) => {
  return (
    <View className="bg-white p-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-2xl font-bold text-gray-800">
          Explore Your Family
        </Text>
        <TouchableOpacity className="flex-row items-center">
          <Text className="text-orange-500 mr-2 font-semibold">See All</Text>
          <Ionicons name="chevron-forward" size={20} color="#f97316" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        {familyTree.map((item) => (
          <TouchableOpacity
            key={item.name}
            className="bg-white rounded-2xl shadow-sm mr-4 w-56 overflow-hidden border border-gray-100"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
          >
            <Image
              source={{ uri: item.image_link }}
              className="w-full h-40 rounded-t-2xl"
              resizeMode="cover"
            />
            <View className="p-3">
              <Text className="text-lg font-semibold text-gray-800 mb-1">
                {item.name}
              </Text>
              <TouchableOpacity 
                className="flex-row items-center mt-2"
                onPress={() => Linking.openURL(item.link)}
              >
                <Text className="text-orange-500 font-medium mr-2">View</Text>
                <Ionicons name="arrow-forward" size={16} color="#f97316" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default FamilyTreeSection;
