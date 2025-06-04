import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  FlatList,
  Linking,
  TextInput,
  StatusBar,
  SafeAreaView,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCommitteeImages, useCommittees } from "@/hooks";
import { supabase } from "@/lib/supabase";

// Define types for our data structures
type Member = {
  id: string;
  name: string;
  phone: string;
  image: string;
  position?: string;
  family_no: number;
};

type CommitteeWithMembers = {
  id: number;
  name: string;
  image: string;
  totalMembers: number;
  members: Member[];
};

export default function Committees() {
  // State for modal visibility and selected committee
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCommittee, setSelectedCommittee] =
    useState<CommitteeWithMembers | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCommittees, setFilteredCommittees] = useState<
    CommitteeWithMembers[]
  >([]);
  const [processedCommittees, setProcessedCommittees] = useState<
    CommitteeWithMembers[]
  >([]);

  // Fetch committees and committee images from Supabase
  const {
    data: committeesData,
    loading: committeesLoading,
    error: committeesError,
    refetch: refetchCommittees,
  } = useCommittees();
  const {
    data: committeeImages,
    loading: imagesLoading,
    error: imagesError,
    refetch: refetchImages,
  } = useCommitteeImages();

  // Process the committee data and images
  useEffect(() => {
    if (committeesData && committeeImages) {
      // Group committees by name to create member lists
      const committeeGroups: Record<string, any[]> = {};

      committeesData.forEach((committee) => {
        if (!committeeGroups[committee.name]) {
          committeeGroups[committee.name] = [];
        }
        committeeGroups[committee.name].push(committee);
      });

      // Create processed committees with members
      const processed = Object.entries(committeeGroups)
        .map(([name, members]) => {
          // Find image URL for this committee
          const imageFile = committeeImages.find(
            (img) =>
              img.name.toLowerCase().replace(/\.[^/.]+$/, "") ===
              name.toLowerCase().trim()
          );

          // Create member objects
          const membersList = members.map((member, index) => ({
            id: `${member.id}`,
            name: member.member_name,
            phone: member.phone,
            image:
              "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg", // Default image
            position: index === 0 ? "Head" : "Member", // Assign positions (you may want to adjust this logic)
            family_no: member.family_no,
          }));

          return {
            id: members[0].id,
            name: name,
            image:
              imageFile?.url ||
              "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=300", // Default image if not found
            totalMembers: members.length,
            members: membersList,
          };
        })
        // Sort committees to prioritize Trustees and Karobari Committee
        .sort((a, b) => {
          const priorityOrder = ["Trustees", "Karobari Committee"];
          const aIndex = priorityOrder.indexOf(a.name);
          const bIndex = priorityOrder.indexOf(b.name);

          // If both committees are in priorityOrder, sort by their priority order
          if (aIndex !== -1 && bIndex !== -1) {
            return aIndex - bIndex;
          }

          // If only one is in priorityOrder, that one comes first
          if (aIndex !== -1) return -1;
          if (bIndex !== -1) return 1;

          // If neither is in priorityOrder, maintain original order
          return 0;
        });

      setProcessedCommittees(processed);
    }
  }, [committeesData, committeeImages]);

  // Filter committees based on search query
  useEffect(() => {
    if (processedCommittees.length > 0) {
      const filtered = processedCommittees.filter((committee) =>
        committee.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCommittees(filtered);
    }
  }, [searchQuery, processedCommittees]);

  // Handle opening the committee details modal
  const handleCommitteePress = (committee: CommitteeWithMembers) => {
    setSelectedCommittee(committee);
    setModalVisible(true);
  };

  // Handle phone call
  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  // Handle WhatsApp
  const handleWhatsApp = (phoneNumber: string) => {
    // Remove any non-numeric characters from the phone number
    const formattedNumber = phoneNumber.replace(/\D/g, "");
    Linking.openURL(`whatsapp://send?phone=${formattedNumber}`);
  };

  // Render member card for the modal
  // Add new state for family modal
  const [familyModalVisible, setFamilyModalVisible] = useState(false);
  const [selectedFamilyData, setSelectedFamilyData] = useState<any>(null);

  // Add function to fetch family data
  const fetchFamilyData = async (familyNo: number) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('family_no', familyNo);

      if (error) throw error;

      if (data && data.length > 0) {
        const familyData = {
          family_no: familyNo,
          members: data.map(member => ({
            id: member.id,
            name: member.name,
            profile_pic: member.profile_pic || 'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg',
            relationship: member.relationship || 'Member',
            occupation: member.occupation || 'Not specified',
            phone: member.mobile_no1,
            email: member.email
          }))
        };
        setSelectedFamilyData(familyData);
        setFamilyModalVisible(true);
      }
    } catch (error) {
      console.error('Error fetching family data:', error);
    }
  };

  // Modify renderMemberItem to handle member click
  const renderMemberItem = ({ item }: { item: Member }) => (
    <TouchableOpacity
      onPress={() => {
        fetchFamilyData(item.family_no);
      }
      }
      className="bg-white rounded-lg shadow-sm p-3 mb-3 flex-row items-center"
    >
      <Image
        source={{ uri: item.image }}
        className="w-12 h-12 rounded-full mr-3"
        resizeMode="cover"
      />
      <View className="flex-1">
        <Text className="font-bold text-gray-800">{item.name}</Text>
        {item.position && (
          <Text className="text-xs text-orange-600 mb-1">{item.position}</Text>
        )}
        <Text className="text-gray-600 text-sm">{item.phone}</Text>
      </View>
      <View className="flex-row">
        <TouchableOpacity
          className="bg-orange-500 w-10 h-10 rounded-full items-center justify-center mr-2"
          onPress={() => handleCall(item.phone)}
        >
          <Ionicons name="call" size={18} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-green-500 w-10 h-10 rounded-full items-center justify-center"
          onPress={() => handleWhatsApp(item.phone)}
        >
          <Ionicons name="logo-whatsapp" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Add Family Modal component
  const FamilyModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={familyModalVisible}
      onRequestClose={() => setFamilyModalVisible(false)}
    >
      <View className="flex-1 justify-end bg-black/50">
        <TouchableWithoutFeedback onPress={() => setFamilyModalVisible(false)}>
          <View className="absolute inset-0" />
        </TouchableWithoutFeedback>

        <View className="bg-white rounded-t-3xl w-full h-[85%]">
          <View className="py-3 items-center">
            <View className="w-12 h-1.5 bg-orange-200 rounded-full" />
          </View>

          {selectedFamilyData && (
            <View className="flex-1 flex">
              <View className="px-5 mb-4">
                <Text className="text-xl font-bold text-orange-800 mb-2">
                  Family Details
                </Text>
                <Text className="text-orange-600">
                  Family No: {selectedFamilyData.family_no}
                </Text>
              </View>

              <FlatList
                data={selectedFamilyData.members}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
                renderItem={({ item }) => (
                  <View className="bg-white rounded-lg shadow-sm p-3 mb-3">
                    <View className="flex-row items-center">
                      <Image
                        source={{ uri: item.profile_pic }}
                        className="w-12 h-12 rounded-full mr-3"
                        resizeMode="cover"
                      />
                      <View className="flex-1">
                        <Text className="font-bold text-gray-800">{item.name}</Text>
                        <Text className="text-xs text-orange-600 mb-1">{item.relationship}</Text>
                        <Text className="text-gray-600 text-sm">{item.occupation}</Text>
                      </View>
                    </View>
                    <View className="flex-row mt-3 justify-end space-x-2">
                      {item.phone && (
                        <TouchableOpacity
                          className="bg-orange-500 w-10 h-10 rounded-full items-center justify-center"
                          onPress={() => handleCall(item.phone)}
                        >
                          <Ionicons name="call" size={18} color="white" />
                        </TouchableOpacity>
                      )}
                      {item.phone && (
                        <TouchableOpacity
                          className="bg-green-500 w-10 h-10 rounded-full items-center justify-center"
                          onPress={() => handleWhatsApp(item.phone)}
                        >
                          <Ionicons name="logo-whatsapp" size={18} color="white" />
                        </TouchableOpacity>
                      )}
                      {item.email && (
                        <TouchableOpacity
                          className="bg-blue-500 w-10 h-10 rounded-full items-center justify-center"
                          onPress={() => Linking.openURL(`mailto:${item.email}`)}
                        >
                          <Ionicons name="mail" size={18} color="white" />
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                )}
              />

              <View className="px-5 py-4 border-t border-gray-200">
                <TouchableOpacity
                  className="bg-orange-600 py-4 rounded-lg"
                  onPress={() => setFamilyModalVisible(false)}
                >
                  <Text className="text-white font-medium text-center text-base">
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  // Add FamilyModal to the return statement
  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      <View className="px-4 pt-4 pb-2">
        {/* iPhone-style Search Bar */}
        <View className=" rounded-xl flex-row items-center px-3 py-2 border border-black/20">
          <Ionicons name="search" size={18} color="#000000" />
          <TextInput
            placeholder="Search committees..."
            placeholderTextColor="#000000"
            className="flex-1 ml-2 text-black/50"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              className="bg-orange-300/30 rounded-full w-5 h-5 items-center justify-center"
            >
              <Ionicons name="close" size={12} color="#000000" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Committee List */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {filteredCommittees.length > 0 ? (
          filteredCommittees.map((committee) => (
            <TouchableOpacity
              key={committee.id}
              className="bg-white rounded-xl overflow-hidden shadow-md mb-4"
              onPress={() => handleCommitteePress(committee)}
            >
              {/* <Image
                source={{ uri: committee.image }}
                className="w-full h-40 rounded-t-xl"
                resizeMode="cover"
              /> */}
              <View className="p-4">
                <Text className="text-lg font-bold text-orange-800">
                  {committee.name}
                </Text>
                <View className="flex-row items-center mt-1">
                  <Ionicons name="people-outline" size={16} color="#D03801" />
                  <Text className="text-orange-600 ml-2">
                    {committee.totalMembers} Members
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="people-outline" size={48} color="#D03801" />
            <Text className="mt-4 text-orange-800 text-center">
              {searchQuery
                ? "No committees match your search"
                : "No committees found"}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Members Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          {/* This touchable will close the modal when tapping outside the content */}
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View className="absolute inset-0" />
          </TouchableWithoutFeedback>

          {/* Modal Content - NOT wrapped in TouchableOpacity */}
          <View className="bg-white rounded-t-3xl w-full h-[85%]">
            {/* Drag handle */}
            <View className="py-3 items-center">
              <View className="w-12 h-1.5 bg-orange-200 rounded-full" />
            </View>

            {selectedCommittee && (
              <View className="flex-1 flex">
                {/* Committee Header - Fixed at top */}
                <View className="px-5">
                  <View className="flex-row items-center mb-4">
                    <Image
                      source={{ uri: selectedCommittee.image }}
                      className="w-16 h-16 rounded-lg mr-3"
                      resizeMode="cover"
                    />
                    <View className="flex-1">
                      <Text className="text-xl font-bold text-orange-800">
                        {selectedCommittee.name}
                      </Text>
                      <Text className="text-orange-600">
                        {selectedCommittee.totalMembers} Members
                      </Text>
                    </View>
                  </View>

                  <Text className="text-lg font-semibold text-orange-800 mb-3">
                    Committee Members
                  </Text>
                </View>

                {/* Scrollable Members List */}
                <View className="flex-1">
                  <FlatList
                    data={selectedCommittee.members}
                    keyExtractor={(item) => item.id}
                    renderItem={(item) => renderMemberItem(item)}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                      paddingHorizontal: 20,
                      paddingBottom: 20,
                    }}
                  />
                </View>

                {/* Close Button - Fixed at bottom */}
                <View className="px-5 py-4 border-t border-gray-200">
                  <TouchableOpacity
                    className="bg-orange-600 py-4 rounded-lg"
                    onPress={() => setModalVisible(false)}
                  >
                    <Text className="text-white font-medium text-center text-base">
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
      <FamilyModal />
    </SafeAreaView >
  );
}
