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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Define types for our data structures
type Member = {
  id: string;
  name: string;
  phone: string;
  image: string;
  position?: string;
};

type Committee = {
  id: string;
  name: string;
  image: string;
  totalMembers: number;
  members: Member[];
};

export default function Committees() {
  // State for modal visibility and selected committee
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCommittee, setSelectedCommittee] = useState<Committee | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCommittees, setFilteredCommittees] = useState<Committee[]>([]);

  // Mock data for committees
  const committees: Committee[] = [
    {
      id: "1",
      name: "Executive Committee",
      image:
        "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=300",
      totalMembers: 8,
      members: [
        {
          id: "1",
          name: "Rajesh Kumar",
          phone: "+91 9876543210",
          image:
            "https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=100",
          position: "President",
        },
        {
          id: "2",
          name: "Priya Sharma",
          phone: "+91 9876543211",
          image:
            "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
          position: "Vice President",
        },
        {
          id: "3",
          name: "Amit Patel",
          phone: "+91 9876543212",
          image:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100",
          position: "Secretary",
        },
        {
          id: "4",
          name: "Neha Singh",
          phone: "+91 9876543213",
          image:
            "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=100",
          position: "Treasurer",
        },
        {
          id: "5",
          name: "Vikram Mehta",
          phone: "+91 9876543214",
          image:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100",
          position: "Member",
        },
        {
          id: "6",
          name: "Ananya Gupta",
          phone: "+91 9876543215",
          image:
            "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100",
          position: "Member",
        },
        {
          id: "7",
          name: "Rahul Verma",
          phone: "+91 9876543216",
          image:
            "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=100",
          position: "Member",
        },
        {
          id: "8",
          name: "Meera Reddy",
          phone: "+91 9876543217",
          image:
            "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100",
          position: "Member",
        },
      ],
    },
    {
      id: "2",
      name: "Cultural Committee",
      image:
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300",
      totalMembers: 6,
      members: [
        {
          id: "9",
          name: "Sanjay Joshi",
          phone: "+91 9876543218",
          image:
            "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100",
          position: "Head",
        },
        {
          id: "10",
          name: "Kavita Nair",
          phone: "+91 9876543219",
          image:
            "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=100",
          position: "Co-Head",
        },
        {
          id: "11",
          name: "Deepak Sharma",
          phone: "+91 9876543220",
          image:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100",
          position: "Member",
        },
        {
          id: "12",
          name: "Ritu Kapoor",
          phone: "+91 9876543221",
          image:
            "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?q=80&w=100",
          position: "Member",
        },
        {
          id: "13",
          name: "Arjun Malhotra",
          phone: "+91 9876543222",
          image:
            "https://images.unsplash.com/photo-1463453091185-61582044d556?q=80&w=100",
          position: "Member",
        },
        {
          id: "14",
          name: "Pooja Desai",
          phone: "+91 9876543223",
          image:
            "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=100",
          position: "Member",
        },
      ],
    },
    {
      id: "3",
      name: "Sports Committee",
      image:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=300",
      totalMembers: 5,
      members: [
        {
          id: "15",
          name: "Vikas Khanna",
          phone: "+91 9876543224",
          image:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100",
          position: "Head",
        },
        {
          id: "16",
          name: "Nisha Patel",
          phone: "+91 9876543225",
          image:
            "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=100",
          position: "Co-Head",
        },
        {
          id: "17",
          name: "Rohit Sharma",
          phone: "+91 9876543226",
          image:
            "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=100",
          position: "Member",
        },
        {
          id: "18",
          name: "Anjali Desai",
          phone: "+91 9876543227",
          image:
            "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=100",
          position: "Member",
        },
        {
          id: "19",
          name: "Karan Malhotra",
          phone: "+91 9876543228",
          image:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100",
          position: "Member",
        },
      ],
    },
    {
      id: "4",
      name: "Education Committee",
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=300",
      totalMembers: 7,
      members: [
        {
          id: "20",
          name: "Suresh Iyer",
          phone: "+91 9876543229",
          image:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100",
          position: "Head",
        },
        {
          id: "21",
          name: "Lakshmi Nair",
          phone: "+91 9876543230",
          image:
            "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=100",
          position: "Co-Head",
        },
        {
          id: "22",
          name: "Ramesh Kumar",
          phone: "+91 9876543231",
          image:
            "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=100",
          position: "Member",
        },
        {
          id: "23",
          name: "Sunita Sharma",
          phone: "+91 9876543232",
          image:
            "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=100",
          position: "Member",
        },
        {
          id: "24",
          name: "Prakash Jha",
          phone: "+91 9876543233",
          image:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100",
          position: "Member",
        },
        {
          id: "25",
          name: "Geeta Patel",
          phone: "+91 9876543234",
          image:
            "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=100",
          position: "Member",
        },
        {
          id: "26",
          name: "Mohan Desai",
          phone: "+91 9876543235",
          image:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100",
          position: "Member",
        },
      ],
    },
    {
      id: "5",
      name: "Finance Committee",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=300",
      totalMembers: 4,
      members: [
        {
          id: "27",
          name: "Anil Kapoor",
          phone: "+91 9876543236",
          image:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100",
          position: "Head",
        },
        {
          id: "28",
          name: "Shobha Iyer",
          phone: "+91 9876543237",
          image:
            "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=100",
          position: "Co-Head",
        },
        {
          id: "29",
          name: "Vijay Mehta",
          phone: "+91 9876543238",
          image:
            "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=100",
          position: "Member",
        },
        {
          id: "30",
          name: "Radha Nair",
          phone: "+91 9876543239",
          image:
            "https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=100",
          position: "Member",
        },
      ],
    },
  ];

  // Filter committees based on search query
  useEffect(() => {
    const filtered = committees.filter((committee) =>
      committee.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredCommittees(filtered);
  }, [searchQuery]);

  // Handle opening the committee details modal
  const handleCommitteePress = (committee: Committee) => {
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
  const renderMemberItem = ({ item }: { item: Member }) => (
    <View className="bg-white rounded-lg shadow-sm p-3 mb-3 flex-row items-center">
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
    </View>
  );

  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* Header */}
      <View className="px-4 pt-4 pb-2">
        {/* iPhone-style Search Bar */}
        <View className="bg-orange-100/40 rounded-xl flex-row items-center px-3 py-2 border border-black/20">
          <Ionicons name="search" size={18} color="#000000" />
          <TextInput
            placeholder="Search committees..."
            placeholderTextColor="#000000"
            className="flex-1 ml-2 text-balck/50"
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
        {filteredCommittees.map((committee) => (
          <TouchableOpacity
            key={committee.id}
            className="bg-white rounded-xl overflow-hidden shadow-md mb-4"
            onPress={() => handleCommitteePress(committee)}
          >
            <Image
              source={{ uri: committee.image }}
              className="w-full h-40 rounded-t-xl"
              resizeMode="cover"
            />
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
        ))}
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
                    renderItem={renderMemberItem}
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
    </SafeAreaView>
  );
}
