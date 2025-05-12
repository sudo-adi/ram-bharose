import React from "react";
import { View, Platform, StatusBar } from "react-native";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";

type HeaderProps = {
  searchQuery: string;
  onSearchChange: (text: string) => void;
  onSearchClear: () => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  categories: string[];
};

const Header = ({
  searchQuery,
  onSearchChange,
  onSearchClear,
  selectedCategory,
  onSelectCategory,
  categories,
}: HeaderProps) => {
  return (
    <View
      className="bg-orange-50 z-10 shadow-sm"
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 10,
      }}
    >
      <View className="px-4 pt-2 pb-3">
        <SearchBar
          value={searchQuery}
          onChangeText={onSearchChange}
          onClear={onSearchClear}
        />
      </View>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />
    </View>
  );
};

export default Header;
