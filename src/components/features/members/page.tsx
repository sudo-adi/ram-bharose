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
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useProfiles } from "@/hooks";
import MemberDetailBottomSheet from "./MemberDetailBottomSheet";

export default function MembersContent() {
  const [viewType, setViewType] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [members, setMembers] = useState([]);
  const [showProfessionDropdown, setShowProfessionDropdown] = useState(false);
  const [professionFilter, setProfessionFilter] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const PAGE_SIZE = 10;

  const { data: profilesData, loading, error, refetch } = useProfiles();

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

  useEffect(() => {
    if (profilesData) {
      const transformedData = profilesData.map((member) => ({
        ...member,
        id: member.id,
        displayName: `${member.name} ${member.surname || ""}`.trim(),
        location: member.residential_address_city || "Unknown",
        displayImage: member.profile_pic || null, // Changed to null instead of default URL
        profession: member.occupation || "Not specified",
        gender: member.gender || "Not specified",
        phone: member.mobile_no1 || "Not available",
        email: member.email || "Not available",
        age: calculateAge(member.date_of_birth),
      }));
      setMembers(transformedData);
      setHasMore(false);
    }
  }, [profilesData]);

  useEffect(() => {
    refetch();
  }, []);

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

  const handleCall = (phoneNumber) => {
    if (phoneNumber && phoneNumber !== "Not available") {
      Linking.openURL(`tel:${phoneNumber}`);
    }
  };

  const handleWhatsApp = (phoneNumber) => {
    if (phoneNumber && phoneNumber !== "Not available") {
      const formattedNumber = phoneNumber.replace(/\D/g, "");
      Linking.openURL(`whatsapp://send?phone=${formattedNumber}`);
    }
  };

  const handleEmail = (email) => {
    if (email && email !== "Not available") {
      Linking.openURL(`mailto:${email}`);
    }
  };

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      searchQuery === "" ||
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.surname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (member.profession &&
        member.profession.toLowerCase().includes(searchQuery.toLowerCase()));

    const hasActiveGenderFilters = activeFilters.gender.length > 0;
    const hasActiveAgeFilters = activeFilters.age.length > 0;
    const hasActiveProfessionFilter = activeFilters.profession !== "";

    if (
      !hasActiveGenderFilters &&
      !hasActiveAgeFilters &&
      !hasActiveProfessionFilter
    ) {
      return matchesSearch;
    }

    const matchesGender =
      !hasActiveGenderFilters || activeFilters.gender.includes(member.gender);

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

    const matchesProfession =
      !hasActiveProfessionFilter ||
      (member.profession &&
        member.profession
          .toLowerCase()
          .includes(activeFilters.profession.toLowerCase()));

    return matchesSearch && matchesGender && matchesAge && matchesProfession;
  });

  const handleFilterPress = (filter) => {
    if (filter.type === "reset") {
      setActiveFilters({
        gender: [],
        age: [],
        profession: "",
      });
      setProfessionFilter("");
      setShowProfessionDropdown(false);
      refetch();
    } else if (filter.type === "gender") {
      setActiveFilters((prev) => {
        const newGenders = prev.gender.includes(filter.id)
          ? prev.gender.filter((g) => g !== filter.id)
          : [...prev.gender, filter.id];
        return { ...prev, gender: newGenders };
      });
    } else if (filter.type === "age") {
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

  const handleMemberPress = (member) => {
    // Find the original member data with all fields
    const originalMember = profilesData.find((m) => m.id === member.id);
    if (originalMember) {
      setSelectedMember(originalMember);
      setBottomSheetVisible(true);
    }
  };

  const paginatedMembers = filteredMembers.slice(0, page * PAGE_SIZE);

  const loadMore = () => {
    if (paginatedMembers.length < filteredMembers.length) {
      setPage(page + 1);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      key={`member-${item.id}`}
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
        {viewType === "list" ? (
          // List view - improved design
          <View className="flex-row items-center">
            <View className="relative">
              <Image
                source={
                  item.displayImage
                    ? { uri: item.displayImage }
                    : getPlaceholderImage(item)
                }
                className="w-16 h-16 rounded-xl"
              />
              <View className="absolute bottom-0 right-0 bg-orange-500 rounded-full p-1">
                <Ionicons name="person" size={12} color="#ffffff" />
              </View>
            </View>

            <View className="flex-1 ml-4">
              <View className="flex-row justify-between items-start">
                <View className="flex-1 pr-2">
                  <Text className="font-bold text-gray-900 text-base">
                    {item.displayName}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Ionicons
                      name="location-outline"
                      size={12}
                      color="#6b7280"
                    />
                    <Text className="text-gray-500 text-xs ml-1">
                      {item.location}
                    </Text>
                  </View>
                  <View className="flex-row items-center mt-1">
                    <Ionicons
                      name="briefcase-outline"
                      size={12}
                      color="#6b7280"
                    />
                    <Text className="text-gray-500 text-xs ml-1">
                      {item.profession}
                    </Text>
                  </View>
                </View>

                <View className="flex-row">
                  {item.phone && item.phone !== "Not available" && (
                    <>
                      <TouchableOpacity
                        className="bg-green-100 p-2 rounded-full mr-2"
                        onPress={() => handleCall(item.phone)}
                      >
                        <Ionicons
                          name="call-outline"
                          size={16}
                          color="#3b82f6"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="bg-blue-100 p-2 rounded-full mr-2"
                        onPress={() => handleWhatsApp(item.phone)}
                      >
                        <Ionicons
                          name="logo-whatsapp"
                          size={16}
                          color="#10b981"
                        />
                      </TouchableOpacity>
                    </>
                  )}
                  {item.email && item.email !== "Not available" && (
                    <TouchableOpacity
                      className="bg-red-100 p-2 rounded-full"
                      onPress={() => handleEmail(item.email)}
                    >
                      <Ionicons name="mail-outline" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View className="flex-row mt-3 space-x-2">
                <View className="bg-blue-50 px-3 py-1 rounded-full flex-row items-center">
                  <Ionicons name="calendar-outline" size={12} color="#3b82f6" />
                  <Text className="text-xs text-blue-800 ml-1 font-medium">
                    {item.age} years
                  </Text>
                </View>
                <View className="bg-purple-50 px-3 py-1 rounded-full flex-row items-center">
                  {item.gender === "Male" ? (
                    <Ionicons name="man-outline" size={12} color="#8b5cf6" />
                  ) : (
                    <Ionicons name="woman-outline" size={12} color="#8b5cf6" />
                  )}
                  <Text className="text-xs text-purple-800 ml-1 font-medium">
                    {item.gender}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        ) : (
          // Grid view - keep existing design
          <View className="flex-col items-center">
            <Image
              source={
                item.displayImage
                  ? { uri: item.displayImage }
                  : getPlaceholderImage(item)
              }
              className="w-20 h-20 mb-3 rounded-full"
            />

            <View className="items-center mt-2">
              <Text className="font-semibold text-gray-900 text-center">
                {item.displayName}
              </Text>
              <Text className="text-gray-500 text-sm text-center mt-1">
                {item.location}
              </Text>
              <Text className="text-gray-500 text-xs text-center mt-1">
                {item.profession}
              </Text>
            </View>

            <View className="flex-row justify-center mt-2 space-x-2 gap-2">
              <Text className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {item.age} years
              </Text>
              <Text className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                {item.gender}
              </Text>
            </View>

            <View className="flex-row justify-center mt-3">
              {item.phone && item.phone !== "Not available" && (
                <>
                  <TouchableOpacity
                    className="bg-green-100 p-2 rounded-full mr-2"
                    onPress={() => handleCall(item.phone)}
                  >
                    <Ionicons name="call-outline" size={16} color="#10b981" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-blue-100 p-2 rounded-full mr-2"
                    onPress={() => handleWhatsApp(item.phone)}
                  >
                    <Ionicons name="logo-whatsapp" size={16} color="#3b82f6" />
                  </TouchableOpacity>
                </>
              )}
              {item.email && item.email !== "Not available" && (
                <TouchableOpacity
                  className="bg-red-100 p-2 rounded-full"
                  onPress={() => handleEmail(item.email)}
                >
                  <Ionicons name="mail-outline" size={16} color="#ef4444" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50"
      style={{
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      {/* Sticky Search Bar */}
      <View
        className="bg-gray-50 z-10 shadow-sm"
        style={{ position: "absolute", top: 0, left: 0, right: 0 }}
      >
        <View className="px-5 py-4">
          <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              placeholder="Search name, city..."
              className="flex-1 ml-2 text-base text-gray-800"
              placeholderTextColor="#666"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery("")}
                className="ml-2"
              >
                <Ionicons name="close-circle" size={18} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filters */}
        <View className="px-5 pb-4">
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
        <View className="px-5 pb-4 flex-row justify-between items-center">
          <Text className="text-gray-500 text-sm">
            {filteredMembers.length} members found
          </Text>
          <View className="flex-row bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100">
            <TouchableOpacity
              onPress={() => setViewType("grid")}
              className={`px-4 py-2 flex-row items-center ${
                viewType === "grid" ? "bg-orange-500" : ""
              }`}
            >
              <Ionicons
                name="grid-outline"
                size={16}
                color={viewType === "grid" ? "#ffffff" : "#6b7280"}
                style={{ marginRight: 4 }}
              />
              <Text
                className={
                  viewType === "grid"
                    ? "text-white font-medium text-sm"
                    : "text-gray-600 text-sm"
                }
              >
                Grid
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setViewType("list")}
              className={`px-4 py-2 flex-row items-center ${
                viewType === "list" ? "bg-orange-500" : ""
              }`}
            >
              <Ionicons
                name="list-outline"
                size={16}
                color={viewType === "list" ? "#ffffff" : "#6b7280"}
                style={{ marginRight: 4 }}
              />
              <Text
                className={
                  viewType === "list"
                    ? "text-white font-medium text-sm"
                    : "text-gray-600 text-sm"
                }
              >
                List
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Content with padding to account for sticky header */}
      <View className="flex-1 px-5 ">
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingTop: 180 }}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View className="items-center justify-center py-10">
              <ActivityIndicator size="large" color="#f97316" />
              <Text className="text-gray-500 mt-2">Loading members...</Text>
            </View>
          ) : (
            <View className="flex-row flex-wrap justify-between">
              {paginatedMembers.map((item) => renderItem({ item }))}
              {paginatedMembers.length < filteredMembers.length && (
                <View className="w-full py-4 items-center">
                  <TouchableOpacity
                    onPress={loadMore}
                    className="bg-orange-100 px-4 py-2 rounded-full flex-row items-center"
                  >
                    <Text className="text-orange-700 font-medium">
                      Load more
                    </Text>
                    <Ionicons
                      name="chevron-down"
                      size={16}
                      color="#c2410c"
                      style={{ marginLeft: 4 }}
                    />
                  </TouchableOpacity>
                </View>
              )}
              {paginatedMembers.length === 0 && (
                <View className="items-center justify-center py-10 w-full">
                  <Ionicons name="people-outline" size={48} color="#9ca3af" />
                  <Text className="text-gray-500 mt-4">No members found</Text>
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </View>

      <MemberDetailBottomSheet
        visible={bottomSheetVisible}
        onClose={() => setBottomSheetVisible(false)}
        member={selectedMember}
      />
    </SafeAreaView>
  );
}

// Function to get the appropriate placeholder image based on age and gender
const getPlaceholderImage = (member) => {
  const age = parseInt(member.age);
  const gender = member.gender?.toLowerCase() || "";

  if (isNaN(age)) {
    // Default fallback if age cannot be determined
    return require("../../../../assets/icon.png");
  }

  // Fix the gender condition to prevent "female" from matching "male"
  if (gender === "male") {
    if (age < 18) {
      return require("../../../../assets/boy.png");
    } else {
      return require("../../../../assets/man.png");
    }
  } else if (gender === "female") {
    if (age < 18) {
      return require("../../../../assets/girl.png");
    } else {
      return require("../../../../assets/women.png");
    }
  } else {
    // Default fallback if gender is not specified
    return require("../../../../assets/icon.png");
  }
};
