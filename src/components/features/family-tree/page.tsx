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
import { useFamilyTree } from "@/hooks";

interface FamilyTreeItem {
  name: string;
  link: string;
  image_link: string;
  description?: string;
}

interface FamilyTreeSectionProps {
  familyTree: FamilyTreeItem[];
}

const FamilyTree = () => {
  const { result: familyTree, loading: familyTreeLoading } = useFamilyTree();

  // Sort family tree alphabetically by name
  const sortedFamilyTree =
    familyTree?.sort((a, b) => a.name.localeCompare(b.name)) || [];

  return (
    <View className="bg-white p-2">
      <ScrollView
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        {sortedFamilyTree.map((item) => (
          <TouchableOpacity
            key={item.name}
            className="bg-white my-2 rounded-xl shadow-sm mx-1 w-screen overflow-hidden border border-gray-100"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
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

export default FamilyTree;
