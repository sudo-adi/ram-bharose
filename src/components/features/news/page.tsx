import { useNews } from "@/hooks";
import { Text, View, ActivityIndicator } from "react-native";
import NewsList from "./sub-components/NewsList";
import ArticleModal from "./sub-components/ArticleModal";
import { useState } from "react";
import React from "react";
import { Article } from "types";

const News = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const handleArticlePress = (article: Article) => {
    setSelectedArticle(article);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    // Optional: Add a small delay before clearing the selected article
    setTimeout(() => setSelectedArticle(null), 300);
  };

  const { data: newsArticles, loading, error } = useNews();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <View className="items-center">
          <ActivityIndicator size="large" color="#f97316" />
          <Text className="text-gray-600 mt-4 font-medium">
            Loading news articles...
          </Text>
          <View className="w-24 h-1 bg-gray-100 rounded-full mt-3 overflow-hidden">
            <View
              className="h-full bg-orange-500 rounded-full animate-pulse"
              style={{ width: "70%" }}
            />
          </View>
        </View>
      </View>
    );
  }

  if (error) {
    console.error("Error loading news articles:", error);
    return (
      <View className="flex-1 items-center justify-center bg-white px-4">
        <Text className="text-red-500 text-center mb-4">
          Error loading news articles
        </Text>
        <Text className="text-gray-600 text-center">
          {error.message || "An unexpected error occurred"}
        </Text>
      </View>
    );
  }

  if (!newsArticles || newsArticles.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-4">
        <Text className="text-gray-600 text-center">
          No news articles available
        </Text>
      </View>
    );
  }

  return (
    <>
      <NewsList
        newsArticles={newsArticles}
        onArticlePress={handleArticlePress}
        formatDate={formatDate}
      />

      <ArticleModal
        article={selectedArticle}
        visible={modalVisible}
        onClose={handleCloseModal}
        formatDate={formatDate}
      />
    </>
  );
};

export default News;

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
