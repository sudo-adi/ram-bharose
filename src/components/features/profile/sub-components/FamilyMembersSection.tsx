import React from "react";
import { View, Text, ScrollView } from "react-native";
import FamilyMemberCard from "./FamilyMemberCard";

interface FamilyMembersSectionProps {
  familyMembers: Array<{
    id: string;
    name: string;
    relation: string;
    age: string;
    gender: string;
    image: string;
  }>;
}

const FamilyMembersSection: React.FC<FamilyMembersSectionProps> = ({
  familyMembers,
}) => {
  return (
    <View className="mb-6">
      <Text className="text-xl font-bold text-gray-800 mb-4">
        Family Members
      </Text>

      {familyMembers.length === 0 ? (
        <View className="items-center justify-center py-8">
          <Text className="text-gray-500">No family members found</Text>
        </View>
      ) : (
        <View>
          {familyMembers.map((member) => (
            <FamilyMemberCard key={member.id} member={member} />
          ))}
        </View>
      )}
    </View>
  );
};

export default FamilyMembersSection;
