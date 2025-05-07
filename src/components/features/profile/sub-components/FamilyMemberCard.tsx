import React from "react";
import { View, Text, Image } from "react-native";

interface FamilyMemberProps {
  member: {
    id: string;
    name: string;
    relation: string;
    age: string;
    gender: string;
    image: string;
  };
}

const FamilyMemberCard: React.FC<FamilyMemberProps> = ({ member }) => {
  return (
    <View className="flex-row items-center p-3 bg-white rounded-xl border border-gray-100 shadow-sm mb-3">
      <Image
        source={{ uri: member.image }}
        className="w-16 h-16 rounded-full"
      />
      <View className="ml-3 flex-1">
        <Text className="font-bold text-gray-800">{member.name}</Text>
        <Text className="text-gray-500">{member.relation}</Text>
        <View className="flex-row mt-1">
          <Text className="text-xs text-gray-400">{member.age}</Text>
          <Text className="text-xs text-gray-400 mx-1">•</Text>
          <Text className="text-xs text-gray-400">{member.gender}</Text>
        </View>
      </View>
    </View>
  );
};

export default FamilyMemberCard;