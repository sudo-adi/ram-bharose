import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

const SearchBar = ({
  value,
  onChangeText,
  placeholder = "Search name, city...",
}: SearchBarProps) => {
  return (
    <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
      <Ionicons name="search" size={20} color="#666" />
      <TextInput
        placeholder={placeholder}
        className="flex-1 ml-2 text-base text-gray-800"
        placeholderTextColor="#666"
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChangeText("")} className="ml-2">
          <Ionicons name="close-circle" size={18} color="#9ca3af" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
