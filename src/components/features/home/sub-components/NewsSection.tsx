import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

type NewsSectionProps = {
  news: any[];
  loading: boolean;
  onArticlePress: (article: any) => void;
  onViewAll?: () => void;
};

const NewsSection = ({
  news,
  loading,
  onArticlePress,
  onViewAll,
}: NewsSectionProps) => {
  // Format date to relative time (e.g., "2 hours ago")
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  // Take only the first 4 news items
  const limitedNews = news?.slice(0, 4) || [];

  if (loading) {
    return (
      <View className="mb-6 items-center justify-center py-8">
        <ActivityIndicator color="#ff8c37" />
      </View>
    );
  }

  if (!news || news.length === 0) {
    return (
      <View className="mb-6">
        <View className="flex-row justify-between items-center px-5 mb-3">
          <Text className="text-lg font-bold text-gray-800">
            Stay Updated 📰
          </Text>
        </View>
        <View className="px-5 py-8 items-center">
          <Text className="text-gray-500">No news available at the moment</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center px-5 mb-3">
        <Text className="text-lg font-bold text-gray-800">Stay Updated 📰</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text className="text-orange-500 text-sm font-medium">View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
      >
        {limitedNews.map((newsItem, index) => (
          <TouchableOpacity
            key={newsItem.id || index}
            className="bg-white rounded-xl mr-3 shadow-sm overflow-hidden w-60 border border-gray-100"
            onPress={() => onArticlePress(newsItem)}
          >
            {/* Only render image if header_image_url exists */}
            {newsItem.header_image_url ? (
              <View className="h-28 w-full overflow-hidden">
                <Image
                  source={{ uri: newsItem.header_image_url }}
                  className="w-full h-full"
                  resizeMode="contain"
                  onError={(error) => {
                    console.log(
                      "News image load error:",
                      error.nativeEvent.error
                    );
                  }}
                />
              </View>
            ) : (
              // Fallback when no image is available
              <View className="h-28 w-full bg-gray-100 items-center justify-center">
                <Ionicons name="image-outline" size={32} color="#9ca3af" />
                <Text className="text-gray-400 text-xs mt-1">No Image</Text>
              </View>
            )}

            <View className="p-3">
              <Text
                className="font-bold text-gray-800 text-xs mb-0.5"
                numberOfLines={2}
              >
                {newsItem.title}
              </Text>
              <Text
                className="text-gray-500 text-[10px] mb-2"
                numberOfLines={2}
              >
                {newsItem.body}
              </Text>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Ionicons name="time-outline" size={10} color="#9ca3af" />
                  <Text className="text-gray-400 text-[10px] ml-0.5">
                    {getRelativeTime(newsItem.created_at)}
                  </Text>
                </View>
                <TouchableOpacity
                  className="flex-row items-center"
                  onPress={() => onArticlePress(newsItem)}
                >
                  <Text className="text-orange-500 text-[10px] font-medium mr-0.5">
                    Read More
                  </Text>
                  <Ionicons name="chevron-forward" size={10} color="#ff8c37" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default NewsSection;
