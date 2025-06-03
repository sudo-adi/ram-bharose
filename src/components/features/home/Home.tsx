import {
  View,
  ScrollView,
  StatusBar,
  Linking,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useBirthdays, useNews } from "@/hooks";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFamilyTree } from "@/hooks";
import { Text, Image } from "react-native";

// Import sub-components
import Header from "./sub-components/Header";
import EventsCarousel from "./sub-components/EventsCarousel";
import BirthdaySection from "./sub-components/BirthdaySection";
import BusinessSection from "./sub-components/BusinessSection";
import CommunitySupportSection from "./sub-components/CommunitySupportSection";
import DirectorySection from "./sub-components/DirectorySection";
import BirthdayWishModal from "./sub-components/BirthdayWishModal";
import NewsSection from "./sub-components/NewsSection";
import ArticleModal from "../news/sub-components/ArticleModal";
import { useEffect, useState } from "react";
import React from "react";
import FamilyTreeSection from "./sub-components/FamilyTreeSection";

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const { data: todayBirthdays, loading: birthdaysLoading } =
    useBirthdays("today");
  const { data: newsData, loading: newsLoading } = useNews();
  const [selectedPerson, setSelectedPerson] = useState(null);
  const [wishModalVisible, setWishModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleModalVisible, setArticleModalVisible] = useState(false);
  const screenWidth = Dimensions.get("window").width;

  // Fetch user profile data
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userPhone = await AsyncStorage.getItem("userPhone");
        if (!userPhone) {
          router.replace("/(auth)/login");
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("name")
          .eq("mobile_no1", userPhone)
          .single();

        if (error) throw error;

        if (profile) {
          setUserName(profile.name);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  // Handle birthday wish
  const handleBirthdayWish = (person) => {
    setSelectedPerson(person);
    setTimeout(() => {
      setWishModalVisible(true);
    }, 100);
  };

  // Handle article selection
  const handleArticlePress = (article) => {
    setSelectedArticle(article);
    setArticleModalVisible(true);
  };

  // Format date for article modal
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle wish options
  const handleWishOption = (option) => {
    if (!selectedPerson) return;

    switch (option) {
      case "whatsapp":
        if (selectedPerson.phone) {
          Linking.openURL(
            `whatsapp://send?phone=${selectedPerson.phone}&text=Happy Birthday ${selectedPerson.name}! Wishing you a wonderful day filled with joy and happiness.`
          );
        }
        break;
      case "sms":
        if (selectedPerson.phone) {
          Linking.openURL(
            `sms:${selectedPerson.phone}?body=Happy Birthday ${selectedPerson.name}! Wishing you a wonderful day filled with joy and happiness.`
          );
        }
        break;
      case "call":
        if (selectedPerson.phone) {
          Linking.openURL(`tel:${selectedPerson.phone}`);
        }
        break;
    }

    setWishModalVisible(false);
  };

  // Check if person has contact info
  const hasContactInfo = (person) => {
    return person && person.phone;
  };

  const { result: familyTree, loading: familyTreeLoading } = useFamilyTree();

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#FF892E" />


      {/* Header Component */}
      <Header userName={userName} getGreeting={getGreeting} />

      <ScrollView
        className="flex-1 pt-6"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Events Carousel Component - with onViewAll prop */}
        <EventsCarousel onViewAll={() => router.push("/calendar")} />

        {/* Directory Section Component */}
        <DirectorySection />

        {/* Birthday Section Component */}
        <BirthdaySection
          todayBirthdays={todayBirthdays}
          birthdaysLoading={birthdaysLoading}
          onWishPress={handleBirthdayWish}
          hasContactInfo={hasContactInfo}
        />

        {/* Family Tree Section Component */}
        <FamilyTreeSection familyTree={familyTree} />

        {/* Women-Led Businesses Component */}
        <BusinessSection
          title="Nari Sahas"
          onViewAll={() => router.push("/businesses")}
        />

        {/* Community Support Component */}
        <CommunitySupportSection onViewAll={() => router.push("/donations")} />

        {/* News Section Component */}
        <NewsSection
          news={newsData}
          loading={newsLoading}
          onArticlePress={handleArticlePress}
          onViewAll={() => router.push("/news")}
        />
      </ScrollView>

      {/* Birthday Wish Modal Component */}
      <BirthdayWishModal
        visible={wishModalVisible}
        onClose={() => setWishModalVisible(false)}
        selectedPerson={selectedPerson}
        onOptionSelect={handleWishOption}
      />

      {/* Article Modal Component */}
      <ArticleModal
        article={selectedArticle}
        visible={articleModalVisible}
        onClose={() => setArticleModalVisible(false)}
        formatDate={formatDate}
      />
    </View>
  );
}
