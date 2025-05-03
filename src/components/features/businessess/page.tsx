import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  ScrollView,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Business = {
  id: string;
  user_id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  contact_email: string;
  contact_phone: string;
  website: string;
  created_at: string;
  images?: string[]; // Array of image URLs for the carousel
  logo?: string; // Business logo URL
  owner?: {
    name: string;
    image: string;
  };
};

export default function Businesses() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Mock data for businesses based on the schema
  const businesses: Business[] = [
    {
      id: "1",
      user_id: "user123",
      name: "Sunrise Bakery",
      category: "Food & Beverages",
      description:
        "Artisan bakery specializing in fresh bread, pastries, and custom cakes for all occasions. We use locally sourced ingredients and traditional baking methods.",
      location: "123 Main Street, Mumbai",
      contact_email: "info@sunrisebakery.com",
      contact_phone: "+91 9876543210",
      website: "www.sunrisebakery.com",
      created_at: "2023-01-15T10:30:00Z",
      images: [
        "https://images.unsplash.com/photo-1608198093002-ad4e005484ec",
        "https://images.unsplash.com/photo-1517433670267-08bbd4be890f",
        "https://images.unsplash.com/photo-1517433367423-c7e5b0f35086",
      ],
      logo: "https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?q=80&w=100",
      owner: {
        name: "Priya Sharma",
        image:
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100",
      },
    },
    {
      id: "2",
      user_id: "user456",
      name: "Green Thumb Nursery",
      category: "Retail",
      description:
        "Your one-stop shop for plants, gardening supplies, and expert advice. We offer a wide variety of indoor and outdoor plants, organic fertilizers, and gardening tools.",
      location: "456 Garden Avenue, Delhi",
      contact_email: "contact@greenthumb.com",
      contact_phone: "+91 9876543211",
      website: "www.greenthumb.com",
      created_at: "2023-02-20T09:15:00Z",
      images: [
        "https://images.unsplash.com/photo-1416879595882-3373a0480b5b",
        "https://images.unsplash.com/photo-1485955900006-10f4d324d411",
        "https://images.unsplash.com/photo-1526397751294-331021109fbd",
      ],
      logo: "https://images.unsplash.com/photo-1611145434336-2cce9e544351?q=80&w=100",
      owner: {
        name: "Raj Patel",
        image:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100",
      },
    },
    {
      id: "3",
      user_id: "user789",
      name: "Tech Solutions",
      category: "Technology",
      description:
        "Professional IT services for small businesses and individuals. We offer computer repairs, network setup, software installation, and tech support.",
      location: "789 Digital Lane, Bangalore",
      contact_email: "support@techsolutions.com",
      contact_phone: "+91 9876543212",
      website: "www.techsolutions.com",
      created_at: "2023-03-10T14:45:00Z",
      images: [
        "https://images.unsplash.com/photo-1531297484001-80022131f5a1",
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
        "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5",
      ],
      logo: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=100",
      owner: {
        name: "Ananya Gupta",
        image:
          "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=100",
      },
    },
    {
      id: "4",
      user_id: "user101",
      name: "Wellness Spa",
      category: "Health & Beauty",
      description:
        "Luxury spa treatments and wellness services to rejuvenate your body and mind. Our services include massages, facials, body treatments, and aromatherapy.",
      location: "101 Relaxation Road, Hyderabad",
      contact_email: "bookings@wellnessspa.com",
      contact_phone: "+91 9876543213",
      website: "www.wellnessspa.com",
      created_at: "2023-04-05T11:20:00Z",
      images: [
        "https://images.unsplash.com/photo-1519823551278-64ac92734fb1",
        "https://images.unsplash.com/photo-1540555700478-4be289fbecef",
        "https://images.unsplash.com/photo-1544161515-4ab6ce6db874",
      ],
      logo: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?q=80&w=100",
      owner: {
        name: "Meera Reddy",
        image:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100",
      },
    },
    {
      id: "5",
      user_id: "user202",
      name: "Creative Crafts",
      category: "Arts & Crafts",
      description:
        "Handmade crafts, art supplies, and workshops for all ages. We sell unique handcrafted items and offer classes in painting, pottery, and other creative arts.",
      location: "202 Artisan Street, Chennai",
      contact_email: "hello@creativecrafts.com",
      contact_phone: "+91 9876543214",
      website: "www.creativecrafts.com",
      created_at: "2023-05-12T16:30:00Z",
      images: [
        "https://images.unsplash.com/photo-1560421683-6856ea585c78",
        "https://images.unsplash.com/photo-1452860606245-08befc0ff44b",
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f",
      ],
      logo: "https://images.unsplash.com/photo-1547333590-47fae5f58d21?q=80&w=100",
      owner: {
        name: "Lakshmi Iyer",
        image:
          "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100",
      },
    },
  ];

  const filteredBusinesses = businesses.filter(
    (business) =>
      business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      business.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleBusinessPress = (business: Business) => {
    setSelectedBusiness(business);
    setCurrentImageIndex(0);
    setModalVisible(true);
  };

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleEmail = (email: string) => {
    Linking.openURL(`mailto:${email}`);
  };

  const handleWebsite = (website: string) => {
    // Add https:// if not present
    const url = website.startsWith("http") ? website : `https://${website}`;
    Linking.openURL(url);
  };

  const handleWhatsApp = (phoneNumber: string) => {
    // Remove any non-numeric characters from the phone number
    const formattedNumber = phoneNumber.replace(/\D/g, "");
    Linking.openURL(`whatsapp://send?phone=${formattedNumber}`);
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

  const renderBusinessCard = ({ item }: { item: Business }) => (
    <TouchableOpacity
      className="mb-4 bg-white rounded-xl overflow-hidden border border-pink-100 shadow-md flex-1 mx-2 p-4"
      onPress={() => handleBusinessPress(item)}
    >
      <View className="mb-3 relative">
        {item.images && item.images.length > 0 && (
          <View className="relative">
            <Image
              source={{ uri: item.images[0] }}
              className="w-full h-32 rounded-lg mb-3"
              resizeMode="cover"
            />
            {/* Business Logo */}
            {item.logo && (
              <Image
                source={{ uri: item.logo }}
                className="absolute top-2 right-2 w-10 h-10 rounded-full border-2 border-white"
                resizeMode="cover"
              />
            )}
          </View>
        )}
        <Text className="text-lg font-bold text-pink-800">{item.name}</Text>
        <Text className="text-pink-600 font-medium text-sm">
          {item.category}
        </Text>
      </View>

      {/* Owner Info */}
      {item.owner && (
        <View className="flex-row items-center mb-3">
          <Image
            source={{ uri: item.owner.image }}
            className="w-6 h-6 rounded-full mr-2"
            resizeMode="cover"
          />
          <Text className="text-gray-700 text-xs">{item.owner.name}</Text>
        </View>
      )}

      <View className="flex-row items-center mb-2">
        <Ionicons name="location-outline" size={14} color="#be185d" />
        <Text className="text-gray-600 text-xs ml-1 flex-1">
          {item.location}
        </Text>
      </View>

      <Text numberOfLines={2} className="text-gray-600 text-xs mb-3">
        {item.description}
      </Text>

      {/* Contact Buttons */}
      <View className="flex-row justify-between mt-2">
        <TouchableOpacity
          className="bg-pink-500 py-2 px-3 rounded-lg items-center flex-1 mr-2"
          onPress={(e) => {
            e.stopPropagation();
            handleCall(item.contact_phone);
          }}
        >
          <Ionicons name="call" size={16} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-green-500 py-2 px-3 rounded-lg items-center flex-1 mr-2"
          onPress={(e) => {
            e.stopPropagation();
            handleWhatsApp(item.contact_phone);
          }}
        >
          <Ionicons name="logo-whatsapp" size={16} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-pink-700 py-2 px-3 rounded-lg items-center flex-1"
          onPress={(e) => {
            e.stopPropagation();
            handleWebsite(item.website);
          }}
        >
          <Ionicons name="globe-outline" size={16} color="white" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-pink-50">
      {/* Header */}
      <View className="px-5">
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 mb-6 border border-pink-100">
          <Ionicons name="search" size={20} color="#be185d" />
          <TextInput
            className="flex-1 ml-2 text-base text-gray-800"
            placeholder="Search by name or category..."
            placeholderTextColor="#9ca3af"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              className="p-1"
            >
              <Ionicons name="close-circle" size={20} color="#be185d" />
            </TouchableOpacity>
          )}
        </View>

        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
        >
          {[
            "All",
            "Food & Beverages",
            "Retail",
            "Technology",
            "Health & Beauty",
            "Arts & Crafts",
          ].map((category) => (
            <TouchableOpacity
              key={category}
              className={`mr-2 px-4 py-2 rounded-full ${
                category === "All"
                  ? "bg-pink-600"
                  : "bg-white border border-pink-200"
              }`}
            >
              <Text
                className={`${
                  category === "All" ? "text-white" : "text-pink-700"
                } font-medium`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Business List */}
      <FlatList
        data={filteredBusinesses}
        keyExtractor={(item) => item.id}
        renderItem={renderBusinessCard}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-10">
            <Ionicons name="business-outline" size={48} color="#f9a8d4" />
            <Text className="text-pink-400 mt-4 text-center">
              No businesses found matching your search
            </Text>
          </View>
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
              <View className="w-12 h-1.5 bg-pink-200 rounded-full" />
            </View>

            {selectedBusiness && (
              <ScrollView
                className="px-6 pt-2 pb-4"
                showsVerticalScrollIndicator={false}
              >
                {/* Image Carousel */}
                {selectedBusiness.images &&
                  selectedBusiness.images.length > 0 && (
                    <View className="mb-6 relative">
                      <Image
                        source={{
                          uri: selectedBusiness.images[currentImageIndex],
                        }}
                        className="w-full h-56 rounded-xl"
                        resizeMode="cover"
                      />

                      {/* Image Navigation */}
                      <View className="flex-row justify-between absolute top-1/2 w-full px-2 -mt-5">
                        <TouchableOpacity
                          onPress={prevImage}
                          className="bg-black/30 w-10 h-10 rounded-full items-center justify-center"
                        >
                          <Ionicons
                            name="chevron-back"
                            size={24}
                            color="white"
                          />
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={nextImage}
                          className="bg-black/30 w-10 h-10 rounded-full items-center justify-center"
                        >
                          <Ionicons
                            name="chevron-forward"
                            size={24}
                            color="white"
                          />
                        </TouchableOpacity>
                      </View>

                      {/* Image Indicators */}
                      <View className="flex-row justify-center absolute bottom-2 w-full">
                        {selectedBusiness.images.map((_, index) => (
                          <View
                            key={index}
                            className={`w-2 h-2 rounded-full mx-1 ${
                              index === currentImageIndex
                                ? "bg-white"
                                : "bg-white/50"
                            }`}
                          />
                        ))}
                      </View>
                    </View>
                  )}

                {/* Business Header with Logo */}
                <View className="items-center mb-6 flex-row justify-center">
                  {selectedBusiness.logo && (
                    <Image
                      source={{ uri: selectedBusiness.logo }}
                      className="w-14 h-14 rounded-full border-2 border-pink-100 mr-3"
                      resizeMode="cover"
                    />
                  )}
                  <View>
                    <Text className="text-xl font-bold text-pink-800">
                      {selectedBusiness.name}
                    </Text>
                    <Text className="text-pink-600 text-base mb-1">
                      {selectedBusiness.category}
                    </Text>
                  </View>
                </View>

                {/* Owner Information */}
                {selectedBusiness.owner && (
                  <View className="flex-row items-center bg-pink-50 p-3 rounded-lg mb-6">
                    <Image
                      source={{ uri: selectedBusiness.owner.image }}
                      className="w-12 h-12 rounded-full mr-3"
                      resizeMode="cover"
                    />
                    <View>
                      <Text className="text-sm text-gray-500">Owner</Text>
                      <Text className="text-base font-medium text-pink-800">
                        {selectedBusiness.owner.name}
                      </Text>
                    </View>
                  </View>
                )}

                {/* Contact Actions */}
                <View className="flex-row justify-around mb-6">
                  <TouchableOpacity
                    className="items-center"
                    onPress={() => handleCall(selectedBusiness.contact_phone)}
                  >
                    <View className="bg-pink-500 w-12 h-12 rounded-full items-center justify-center mb-1">
                      <Ionicons name="call" size={20} color="white" />
                    </View>
                    <Text className="text-xs text-gray-600">Call</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="items-center"
                    onPress={() =>
                      handleWhatsApp(selectedBusiness.contact_phone)
                    }
                  >
                    <View className="bg-green-500 w-12 h-12 rounded-full items-center justify-center mb-1">
                      <Ionicons name="logo-whatsapp" size={20} color="white" />
                    </View>
                    <Text className="text-xs text-gray-600">WhatsApp</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="items-center"
                    onPress={() => handleEmail(selectedBusiness.contact_email)}
                  >
                    <View className="bg-pink-600 w-12 h-12 rounded-full items-center justify-center mb-1">
                      <Ionicons name="mail" size={20} color="white" />
                    </View>
                    <Text className="text-xs text-gray-600">Email</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    className="items-center"
                    onPress={() => handleWebsite(selectedBusiness.website)}
                  >
                    <View className="bg-pink-700 w-12 h-12 rounded-full items-center justify-center mb-1">
                      <Ionicons name="globe" size={20} color="white" />
                    </View>
                    <Text className="text-xs text-gray-600">Website</Text>
                  </TouchableOpacity>
                </View>

                {/* Business Details */}
                <View className="mb-6">
                  <Text className="text-lg font-semibold text-pink-800 mb-4">
                    Business Information
                  </Text>

                  <View className="space-y-4">
                    <View className="flex-row items-start">
                      <Ionicons
                        name="information-circle-outline"
                        size={18}
                        color="#be185d"
                        className="mt-0.5 mr-3 w-6"
                      />
                      <View className="flex-1">
                        <Text className="text-pink-600 text-xs mb-1">
                          Description
                        </Text>
                        <Text className="text-gray-800 text-sm">
                          {selectedBusiness.description}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-start">
                      <Ionicons
                        name="location-outline"
                        size={18}
                        color="#be185d"
                        className="mt-0.5 mr-3 w-6"
                      />
                      <View className="flex-1">
                        <Text className="text-pink-600 text-xs mb-1">
                          Location
                        </Text>
                        <Text className="text-gray-800 text-sm">
                          {selectedBusiness.location}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-start">
                      <Ionicons
                        name="call-outline"
                        size={18}
                        color="#be185d"
                        className="mt-0.5 mr-3 w-6"
                      />
                      <View className="flex-1">
                        <Text className="text-pink-600 text-xs mb-1">
                          Phone
                        </Text>
                        <Text className="text-gray-800 text-sm">
                          {selectedBusiness.contact_phone}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-start">
                      <Ionicons
                        name="mail-outline"
                        size={18}
                        color="#be185d"
                        className="mt-0.5 mr-3 w-6"
                      />
                      <View className="flex-1">
                        <Text className="text-pink-600 text-xs mb-1">
                          Email
                        </Text>
                        <Text className="text-gray-800 text-sm">
                          {selectedBusiness.contact_email}
                        </Text>
                      </View>
                    </View>

                    <View className="flex-row items-start">
                      <Ionicons
                        name="globe-outline"
                        size={18}
                        color="#be185d"
                        className="mt-0.5 mr-3 w-6"
                      />
                      <View className="flex-1">
                        <Text className="text-pink-600 text-xs mb-1">
                          Website
                        </Text>
                        <Text className="text-gray-800 text-sm">
                          {selectedBusiness.website}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Close Button - Made more prominent */}
                <TouchableOpacity
                  className="bg-pink-600 py-4 rounded-lg mt-4 mb-10"
                  onPress={() => setModalVisible(false)}
                >
                  <Text className="text-white font-medium text-center text-base">
                    Close
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
