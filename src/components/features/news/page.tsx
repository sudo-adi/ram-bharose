import React, { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const News = () => {
  const [activeView, setActiveView] = useState("list"); // "list" or "detail"
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Mock data for news articles
  const newsArticles = [
    {
      id: 1,
      title: "Community Gathering Success",
      summary:
        "Over 200 members attended our annual community gathering last weekend.",
      content:
        "Our annual community gathering was a tremendous success with over 200 members in attendance. The event featured cultural performances, recognition of community achievements, and discussions about upcoming initiatives. Many members expressed their appreciation for the opportunity to connect with others and strengthen community bonds. The organizing committee has already begun planning for next year's event, with hopes to make it even more inclusive and engaging.",
      date: "Nov 10, 2023",
      author: "Rajesh Sharma",
      category: "Events",
      images: [
        "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000",
        "https://images.unsplash.com/photo-1540317580256-e6b80d604449?q=80&w=1000",
      ],
      readTime: "3 min",
    },
    {
      id: 2,
      title: "New Educational Scholarships Announced",
      summary:
        "The community foundation has announced 10 new scholarships for deserving students.",
      content:
        "The community foundation has proudly announced 10 new scholarships for deserving students pursuing higher education. These scholarships will cover tuition fees and provide a monthly stipend for living expenses. Eligible candidates must be active community members with strong academic records and demonstrated financial need. Applications will open next month, and recipients will be announced in January. This initiative aims to support educational advancement within our community and help promising students achieve their academic goals without financial burden.",
      date: "Oct 25, 2023",
      author: "Priya Patel",
      category: "Education",
      images: [
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=1000",
        "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?q=80&w=1000",
      ],
      readTime: "4 min",
    },
    {
      id: 3,
      title: "Health Camp Scheduled for December",
      summary:
        "A free health checkup camp will be organized on December 15th at the community center.",
      content:
        "A comprehensive free health checkup camp will be organized on December 15th at the community center. The camp will offer various health screenings including blood pressure monitoring, diabetes testing, eye examinations, and general consultations with healthcare professionals. Community members of all ages are encouraged to participate and take advantage of this opportunity to assess their health status. Pre-registration is recommended but not required. The health committee has partnered with local hospitals and clinics to ensure quality service and follow-up care if needed.",
      date: "Oct 15, 2023",
      author: "Dr. Anand Mehta",
      category: "Health",
      images: [
        "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=1000",
        "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=1000",
      ],
      readTime: "2 min",
    },
  ];

  const handleArticlePress = (article) => {
    setSelectedArticle(article);
    setActiveView("detail");
  };

  const handleBackPress = () => {
    setActiveView("list");
    setSelectedArticle(null);
  };

  // News List View
  const renderNewsList = () => (
    <ScrollView className="flex-1 bg-white pt-14">
      <View className="px-5 py-4">
        <Text className="text-2xl font-bold text-gray-800 mb-1">
          News & Updates
        </Text>
        <Text className="text-gray-500 mb-6">
          Stay informed with the latest community news
        </Text>

        {/* News Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
        >
          {["All", "Events", "Education", "Health", "Culture"].map(
            (category) => (
              <TouchableOpacity
                key={category}
                className={`mr-2 px-4 py-2 rounded-full ${
                  category === "All" ? "bg-orange-500" : "bg-gray-100"
                }`}
              >
                <Text
                  className={`${
                    category === "All" ? "text-white" : "text-gray-700"
                  } font-medium`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            )
          )}
        </ScrollView>

        {/* News Articles */}
        {newsArticles.map((article) => (
          <TouchableOpacity
            key={article.id}
            className="mb-6 bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm"
            onPress={() => handleArticlePress(article)}
          >
            <Image
              source={{ uri: article.images[0] }}
              className="w-full h-48"
              resizeMode="cover"
            />
            <View className="p-4">
              <View className="flex-row justify-between items-center mb-2">
                <View className="bg-orange-100 px-2 py-1 rounded">
                  <Text className="text-orange-600 text-xs font-medium">
                    {article.category}
                  </Text>
                </View>
                <Text className="text-gray-500 text-xs">
                  {article.date} • {article.readTime}
                </Text>
              </View>
              <Text className="text-xl font-bold text-gray-800 mb-2">
                {article.title}
              </Text>
              <Text className="text-gray-600 mb-3" numberOfLines={2}>
                {article.summary}
              </Text>
              <View className="flex-row items-center">
                <View className="w-6 h-6 bg-gray-200 rounded-full mr-2" />
                <Text className="text-gray-700 text-sm">{article.author}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  // News Detail View
  const renderNewsDetail = () => {
    if (!selectedArticle) return null;

    return (
      <View className="flex-1 bg-white">
        {/* Header with back button */}
        <View className="pt-14 px-4 flex-row items-center">
          <TouchableOpacity
            onPress={handleBackPress}
            className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-xl font-bold ml-4">Article</Text>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Article Content */}
          <View className="p-4">
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              {selectedArticle.title}
            </Text>

            <View className="flex-row justify-between items-center mb-4">
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-gray-200 rounded-full mr-2" />
                <Text className="text-gray-700">{selectedArticle.author}</Text>
              </View>
              <Text className="text-gray-500 text-sm">
                {selectedArticle.date} • {selectedArticle.readTime}
              </Text>
            </View>

            {/* Main Image */}
            <Image
              source={{ uri: selectedArticle.images[0] }}
              className="w-full h-56 rounded-xl mb-4"
              resizeMode="cover"
            />

            {/* Article Text */}
            <Text className="text-gray-800 leading-6 mb-6">
              {selectedArticle.content}
            </Text>

            {/* Additional Images */}
            {selectedArticle.images.slice(1).map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                className="w-full h-48 rounded-xl mb-4"
                resizeMode="cover"
              />
            ))}

            {/* Tags */}
            <View className="flex-row flex-wrap mt-2 mb-6">
              {[selectedArticle.category, "Community", "Updates"].map(
                (tag, index) => (
                  <View
                    key={index}
                    className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2"
                  >
                    <Text className="text-gray-700 text-xs">{tag}</Text>
                  </View>
                )
              )}
            </View>

            {/* Share and Bookmark */}
            <View className="flex-row justify-between mt-4 pt-4 border-t border-gray-100">
              <TouchableOpacity className="flex-row items-center">
                <Ionicons name="share-social-outline" size={20} color="#666" />
                <Text className="text-gray-700 ml-2">Share</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center">
                <Ionicons name="bookmark-outline" size={20} color="#666" />
                <Text className="text-gray-700 ml-2">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  return activeView === "list" ? renderNewsList() : renderNewsDetail();
};

export default News;
