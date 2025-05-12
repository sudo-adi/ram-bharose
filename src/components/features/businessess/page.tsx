import React, { useState, useMemo } from "react";
import {
  View,
  FlatList,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";

// Import components
import { Business } from "./sub-componenets/types";
import LoadingState from "./sub-componenets/LoadingState";
import ErrorState from "./sub-componenets/ErrorState";
import EmptyState from "./sub-componenets/EmptyState";
import BusinessCard from "./sub-componenets/BusinessCard";
import Header from "./sub-componenets/Header";
import BusinessDetail from "./sub-componenets/BusinessDetail";
import { useBusiness } from "@/hooks";

export default function Businesses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: businesses, loading, error } = useBusiness();

  // Extract unique categories from business data
  const categories = useMemo(() => {
    if (!businesses || businesses.length === 0) return ["All"];

    // Get unique categories from business data
    const uniqueCategories = [
      ...new Set(businesses.map((business) => business.category)),
    ];

    // Add "All" as the first option and sort the rest alphabetically
    return ["All", ...uniqueCategories.sort()];
  }, [businesses]);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState />;
  if (!businesses || businesses.length === 0) return <EmptyState />;

  const handleBusinessPress = (business: Business) => {
    setSelectedBusiness(business);
    setCurrentImageIndex(0);
    setModalVisible(true);
  };

  const nextImage = () => {
    if (selectedBusiness?.images) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === selectedBusiness.images!.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedBusiness?.images) {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === 0 ? selectedBusiness.images!.length - 1 : prevIndex - 1
      );
    }
  };

  const clearSearch = () => setSearchQuery("");

  const filteredBusinesses = businesses.filter((business) => {
    const matchesSearch =
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.category.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || business.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView
      className="flex-1 bg-orange-50"
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      {/* Header with Search and Filters */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchClear={clearSearch}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categories}
      />

      {/* Business List */}
      <FlatList
        data={filteredBusinesses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <BusinessCard business={item} onPress={handleBusinessPress} />
        )}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingBottom: 20,
          paddingTop: 120, // Added paddingTop to account for fixed header
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState message="No businesses found matching your search" />
        }
      />

      {/* Business Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 justify-end bg-black/40"
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View className="bg-white rounded-t-3xl w-full max-h-[98%]">
            {/* Drag handle */}
            <View className="py-3 items-center">
              <View className="w-12 h-1.5 bg-orange-200 rounded-full" />
            </View>

            {selectedBusiness && (
              <BusinessDetail
                business={selectedBusiness}
                currentImageIndex={currentImageIndex}
                onNextImage={nextImage}
                onPrevImage={prevImage}
                onClose={() => setModalVisible(false)}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
