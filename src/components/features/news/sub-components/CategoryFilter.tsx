import React from "react";
import { ScrollView, TouchableOpacity, Text } from "react-native";

type CategoryFilterProps = {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
};

const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-6"
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          className={`mr-2 px-4 py-2 rounded-full ${
            category === selectedCategory ? "bg-orange-500" : "bg-gray-100"
          }`}
          onPress={() => onSelectCategory(category)}
        >
          <Text
            className={`${
              category === selectedCategory ? "text-white" : "text-gray-700"
            } font-medium`}
          >
            {category}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

export default CategoryFilter;
