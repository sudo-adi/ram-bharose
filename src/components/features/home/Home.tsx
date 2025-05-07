import { View, ScrollView, StatusBar, Linking, Dimensions } from "react-native";
import { useBirthdays, useNews } from "@/hooks/useSupabase";
import { useUser } from "@clerk/clerk-expo";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";

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

export default function Home() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const { user } = useUser();
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
        const userEmail = user?.emailAddresses[0]?.emailAddress;
        if (!userEmail) return;

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("name")
          .eq("email", userEmail)
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
  }, [user]);

  // Event data
  // Remove the hardcoded events array
  // const events = [ ... ];

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

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" />

      {/* Header Component */}
      <Header userName={userName} getGreeting={getGreeting} />

      <ScrollView
        className="flex-1 pt-6"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Events Carousel Component - no longer needs events prop */}
        <EventsCarousel />

        {/* Directory Section Component */}
        <DirectorySection />

        {/* Birthday Section Component */}
        <BirthdaySection
          todayBirthdays={todayBirthdays}
          birthdaysLoading={birthdaysLoading}
          onWishPress={handleBirthdayWish}
          hasContactInfo={hasContactInfo}
        />

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
