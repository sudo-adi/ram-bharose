import React from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface PersonalInfoItemProps {
  icon: string;
  iconColor: string;
  bgColor: string;
  label: string;
  value: string;
  isEditing: boolean;
  onEdit?: () => void;
  onChangeText?: (text: string) => void;
  editable?: boolean;
}

const PersonalInfoItem: React.FC<PersonalInfoItemProps> = ({
  icon,
  iconColor,
  bgColor,
  label,
  value,
  isEditing,
  onEdit,
  onChangeText,
  editable = true,
}) => {
  return (
    <View className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
      <View className="flex-row items-center mb-2">
        <View className={`${bgColor} p-2 rounded-full`}>
          <Ionicons name={icon as any} size={20} color={iconColor} />
        </View>
        <Text className="text-gray-400 text-sm ml-3">{label}</Text>
      </View>
      <View className="flex-row items-center justify-between">
        {isEditing && editable ? (
          <TextInput
            value={value}
            onChangeText={onChangeText}
            className="flex-1 text-gray-800 text-base"
          />
        ) : (
          <Text className="text-gray-800 text-base">{value}</Text>
        )}
        {editable && (
          <TouchableOpacity onPress={onEdit}>
            <Ionicons name="pencil" size={18} color="#ff7e54" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default PersonalInfoItem;
