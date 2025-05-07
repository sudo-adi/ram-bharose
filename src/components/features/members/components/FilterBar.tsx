import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Filter = {
  id: string;
  label: string;
  icon: string;
  type: string;
};

type FilterBarProps = {
  filters: Filter[];
  activeFilters: {
    gender: string[];
    age: string[];
    profession: string;
  };
  showProfessionDropdown: boolean;
  professionFilter: string;
  onFilterPress: (filter: Filter) => void;
  onProfessionChange: (text: string) => void;
  isFilterActive: (filter: Filter) => boolean;
};

const FilterBar = ({
  filters,
  activeFilters,
  showProfessionDropdown,
  professionFilter,
  onFilterPress,
  onProfessionChange,
  isFilterActive,
}: FilterBarProps) => {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 20 }}
      >
        <View className="flex-row space-x-2 flex gap-2">
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              onPress={() => onFilterPress(filter)}
              className={`px-4 py-2 rounded-full flex-row items-center ${
                isFilterActive(filter) ? "bg-orange-500" : "bg-white"
              }`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: isFilterActive(filter) ? 0.2 : 0.05,
                shadowRadius: 2,
                elevation: isFilterActive(filter) ? 2 : 1,
              }}
            >
              <Ionicons
                name={filter.icon as any}
                size={16}
                color={isFilterActive(filter) ? "#fff" : "#6b7280"}
                style={{ marginRight: 6 }}
              />
              <Text
                className={`text-sm ${
                  isFilterActive(filter) ? "text-white" : "text-gray-700"
                }`}
              >
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {showProfessionDropdown && (
        <View className="mt-2">
          <TextInput
            placeholder="Enter profession..."
            className="bg-white rounded-xl px-4 py-2 text-base text-gray-800"
            placeholderTextColor="#666"
            value={professionFilter}
            onChangeText={onProfessionChange}
          />
        </View>
      )}
    </View>
  );
};

export default FilterBar;
