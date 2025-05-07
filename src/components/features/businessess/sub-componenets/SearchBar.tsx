import React from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
};

const SearchBar = ({ value, onChangeText, onClear }: SearchBarProps) => {
  return (
    <View className="flex-row items-center bg-white rounded-xl px-4 py-3 border border-pink-100 shadow-sm">
      <Ionicons name="search" size={20} color="#be185d" />
      <TextInput
        className="flex-1 ml-2 text-base text-gray-800"
        placeholder="Search by name or category..."
        placeholderTextColor="#9ca3af"
        value={value}
        onChangeText={onChangeText}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} className="p-1">
          <Ionicons name="close-circle" size={20} color="#be185d" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
