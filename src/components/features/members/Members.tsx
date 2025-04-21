import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
  ScrollView,
  Linking,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "@/lib/supabase";
import { router } from "expo-router";

export default function MembersContent() {
  const [viewType, setViewType] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showProfessionDropdown, setShowProfessionDropdown] = useState(false);
  const [professionFilter, setProfessionFilter] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;

  // Filters state
  const [activeFilters, setActiveFilters] = useState({
    gender: [],
    age: [],
    profession: "",
  });

  const filters = [
    { id: "all", label: "All", icon: "people-outline", type: "reset" },
    { id: "Male", label: "Men", icon: "man-outline", type: "gender" },
    { id: "Female", label: "Women", icon: "woman-outline", type: "gender" },
    { id: "18-24", label: "18-24", icon: "calendar-outline", type: "age" },
    { id: "25-34", label: "25-34", icon: "calendar-outline", type: "age" },
    { id: "35-44", label: "35-44", icon: "calendar-outline", type: "age" },
    { id: "45-54", label: "45-54", icon: "calendar-outline", type: "age" },
    { id: "55+", label: "55+", icon: "calendar-outline", type: "age" },
    {
      id: "profession",
      label: "Profession",
      icon: "briefcase-outline",
      type: "profession",
    },
  ];

  // Fetch members from Supabase with pagination
  const fetchMembers = async (reset = false) => {
    try {
      const currentPage = reset ? 1 : page;
      setLoading(reset);
      setLoadingMore(!reset);

      const from = (currentPage - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      let query = supabase
        .from("profiles")
        .select("*")
        .order("surname", { ascending: true })
        .range(from, to);

      const { data, error, count } = await query;

      if (error) {
        console.error("Error fetching members:", error);
        return;
      }

      // Transform data for display
      const transformedData = data.map((member) => ({
        ...member,
        id: member.id, // This is the UUID from Supabase
        displayName: `${member.name} ${member.surname || ""}`.trim(),
        location: member.residential_address_city || "Unknown",
        displayImage:
          member.profile_pic ||
          "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg",
        profession: member.occupation || "Not specified",
        gender: member.gender || "Not specified",
        phone: member.mobile_no1 || "Not available",
        email: member.email || "Not available",
        age: calculateAge(member.date_of_birth),
      }));

      if (reset) {
        setMembers(transformedData);
      } else {
        setMembers((prev) => [...prev, ...transformedData]);
      }

      setHasMore(data.length === PAGE_SIZE);
      if (reset) setPage(2);
      else setPage((prev) => prev + 1);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more data when reaching end of list
  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchMembers();
    }
  };

  // Initial load
  useEffect(() => {
    fetchMembers(true);
  }, []);

  // Helper function to calculate age from date of birth
  const calculateAge = (dob) => {
    if (!dob) return "Unknown";

    const parts = dob.split("/");
    if (parts.length !== 3) return "Unknown";

    const day = parseInt(parts[0]);
    const monthStr = parts[1];
    const yearStr = parts[2];

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months.indexOf(monthStr);

    if (isNaN(day) || month === -1) return "Unknown";

    let year = parseInt(yearStr);
    if (year < 100) {
      year = year < 50 ? 2000 + year : 1900 + year;
    }

    const birthDate = new Date(year, month, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    if (
      today.getMonth() < birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age.toString();
  };

  // Handle phone call
  const handleCall = (phoneNumber) => {
    if (phoneNumber && phoneNumber !== "Not available") {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  // Handle WhatsApp message
  const handleWhatsApp = (phoneNumber) => {
    if (phoneNumber && phoneNumber !== "Not available") {
      const formattedNumber = phoneNumber.replace(/\D/g, "");
      Linking.openURL(`whatsapp://send?phone=${formattedNumber}`);
    }
  };

  // Filter members based on active filters and search query
  const filteredMembers = members.filter((member) => {
    // Filter by search query
    const matchesSearch =
      searchQuery === "" ||
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.surname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.profession &&
        member.profession.toLowerCase().includes(searchQuery.toLowerCase()));

    // Check if any filters are active
    const hasActiveGenderFilters = activeFilters.gender.length > 0;
    const hasActiveAgeFilters = activeFilters.age.length > 0;
    const hasActiveProfessionFilter = activeFilters.profession !== "";

    // If no filters are active, show all results that match search
    if (
      !hasActiveGenderFilters &&
      !hasActiveAgeFilters &&
      !hasActiveProfessionFilter
    ) {
      return matchesSearch;
    }

    // Check gender filter
    const matchesGender =
      !hasActiveGenderFilters || activeFilters.gender.includes(member.gender);

    // Check age filter
    let matchesAge = !hasActiveAgeFilters;
    if (hasActiveAgeFilters) {
      const age = parseInt(member.age);
      if (!isNaN(age)) {
        matchesAge = activeFilters.age.some((ageRange) => {
          if (ageRange === "18-24") return age >= 18 && age <= 24;
          if (ageRange === "25-34") return age >= 25 && age <= 34;
          if (ageRange === "35-44") return age >= 35 && age <= 44;
          if (ageRange === "45-54") return age >= 45 && age <= 54;
          if (ageRange === "55+") return age >= 55;
          return false;
        });
      }
    }

    // Check profession filter
    const matchesProfession =
      !hasActiveProfessionFilter ||
      (member.profession &&
        member.profession
          .toLowerCase()
          .includes(activeFilters.profession.toLowerCase()));

    return matchesSearch && matchesGender && matchesAge && matchesProfession;
  });

  // Handle filter selection
  const handleFilterPress = (filter) => {
    if (filter.type === "reset") {
      // Reset all filters
      setActiveFilters({
        gender: [],
        age: [],
        profession: "",
      });
      setProfessionFilter("");
      setShowProfessionDropdown(false);
      fetchMembers(true);
    } else if (filter.type === "gender") {
      // Toggle gender filter
      setActiveFilters((prev) => {
        const newGenders = prev.gender.includes(filter.id)
          ? prev.gender.filter((g) => g !== filter.id)
          : [...prev.gender, filter.id];
        return { ...prev, gender: newGenders };
      });
    } else if (filter.type === "age") {
      // Toggle age filter
      setActiveFilters((prev) => {
        const newAges = prev.age.includes(filter.id)
          ? prev.age.filter((a) => a !== filter.id)
          : [...prev.age, filter.id];
        return { ...prev, age: newAges };
      });
    } else if (filter.type === "profession") {
      setShowProfessionDropdown(!showProfessionDropdown);
    }
  };

  // Check if a filter is active
  const isFilterActive = (filter) => {
    if (filter.type === "gender") {
      return activeFilters.gender.includes(filter.id);
    } else if (filter.type === "age") {
      return activeFilters.age.includes(filter.id);
    } else if (filter.id === "all") {
      return (
        activeFilters.gender.length === 0 &&
        activeFilters.age.length === 0 &&
        activeFilters.profession === ""
      );
    }
    return false;
  };

  // Navigate to member detail screen
  const handleMemberPress = (member) => {
    router.push({
      pathname: "/member-detail",
      params: { memberId: member.id },
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      key={`member-${item.id}`} // Updated key to ensure uniqueness
      className={`bg-white rounded-2xl mb-4 overflow-hidden ${
        viewType === "grid" ? "w-[48%]" : "w-full"
      }`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
      onPress={() => handleMemberPress(item)}
      activeOpacity={0.7}
    >
      <View className="p-4">
        <View
          className={`flex-row ${
            viewType === "list" ? "items-center" : "flex-col items-center"
          }`}
        >
          <Image
            source={{ uri: item.displayImage }}
            className={`rounded-full ${
              viewType === "list" ? "w-14 h-14 mr-4" : "w-20 h-20 mb-3"
            }`}
          />

          <View
            className={`${
              viewType === "list" ? "flex-1" : "items-center mt-2"
            }`}
          >
            <Text className="font-semibold text-gray-900 text-center">
              {item.displayName}
            </Text>
            <Text className="text-gray-500 text-sm text-center mt-1">
              {item.location}
            </Text>
            <Text className="text-gray-500 text-xs text-center mt-1">
              {item.profession}
            </Text>

            {viewType === "list" && (
              <View className="flex-row mt-2 space-x-2">
                <Text className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {item.age} years
                </Text>
                <Text className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  {item.gender}
                </Text>
              </View>
            )}
          </View>
        </View>

        {viewType === "grid" && (
          <View className="flex-row justify-center mt-2 space-x-2">
            <Text className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {item.age} years
            </Text>
            <Text className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
              {item.gender}
            </Text>
          </View>
        )}

        <View
          className={`flex-row ${
            viewType === "list" ? "justify-end" : "justify-center"
          } mt-3`}
        >
          <TouchableOpacity
            className="bg-green-100 p-2 rounded-full mr-2"
            onPress={() => handleCall(item.phone)}
          >
            <Ionicons name="call-outline" size={16} color="#10b981" />
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-blue-100 p-2 rounded-full"
            onPress={() => handleWhatsApp(item.phone)}
          >
            <Ionicons name="logo-whatsapp" size={16} color="#3b82f6" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50 pt-20">
      {/* Search Bar */}
      <View className="px-4 pb-2">
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            placeholder="Search name, city..."
            className="flex-1 ml-2 text-base text-gray-800"
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text);
              // Reset to first page when search changes
              fetchMembers(true);
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#9ca3af" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}
      <View className="px-6 pb-4">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 20 }}
        >
          <View className="flex-row space-x-2 flex gap-2">
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                onPress={() => handleFilterPress(filter)}
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

        {/* Profession filter input */}
        {showProfessionDropdown && (
          <View className="mt-2">
            <TextInput
              placeholder="Enter profession..."
              className="bg-white rounded-xl px-4 py-2 text-base text-gray-800"
              placeholderTextColor="#666"
              value={professionFilter}
              onChangeText={(text) => {
                setProfessionFilter(text);
                setActiveFilters((prev) => ({ ...prev, profession: text }));
              }}
            />
          </View>
        )}
      </View>

      {/* View Toggle */}
      <View className="px-6 pb-4 flex-row justify-between items-center">
        <Text className="text-gray-500 text-sm">
          {filteredMembers.length} members found
        </Text>
        <View className="flex-row bg-white rounded-xl p-1 shadow-sm">
          <TouchableOpacity
            onPress={() => setViewType("grid")}
            className={`p-2 rounded-lg ${
              viewType === "grid" ? "bg-gray-100" : ""
            }`}
          >
            <Ionicons
              name="grid"
              size={18}
              color={viewType === "grid" ? "#f97316" : "#9ca3af"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setViewType("list")}
            className={`p-2 rounded-lg ${
              viewType === "list" ? "bg-gray-100" : ""
            }`}
          >
            <Ionicons
              name="list"
              size={18}
              color={viewType === "list" ? "#f97316" : "#9ca3af"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Members List */}
      <View className="flex-1 px-6 pb-6">
        {loading ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" color="#f97316" />
            <Text className="text-gray-500 mt-2">Loading members...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredMembers}
            renderItem={renderItem}
            keyExtractor={(item) => item.id} // Use the UUID from Supabase
            numColumns={viewType === "grid" ? 2 : 1}
            columnWrapperStyle={
              viewType === "grid" ? { justifyContent: "space-between" } : null
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            onEndReached={loadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore ? (
                <View className="py-4">
                  <ActivityIndicator size="small" color="#f97316" />
                </View>
              ) : null
            }
            ListEmptyComponent={
              <View className="items-center justify-center py-10">
                <Ionicons name="people-outline" size={48} color="#9ca3af" />
                <Text className="text-gray-500 mt-4">No members found</Text>
              </View>
            }
          />
        )}
      </View>
    </View>
  );
}
