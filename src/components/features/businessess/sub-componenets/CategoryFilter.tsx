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
      className="pb-2 px-4"
    >
      {categories.map((category) => (
        <TouchableOpacity
          key={category}
          className={`mr-2 px-4 py-2 rounded-full ${
            category === selectedCategory
              ? "bg-pink-600"
              : "bg-white border border-pink-200"
          }`}
          onPress={() => onSelectCategory(category)}
        >
          <Text
            className={`${
              category === selectedCategory ? "text-white" : "text-pink-700"
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
