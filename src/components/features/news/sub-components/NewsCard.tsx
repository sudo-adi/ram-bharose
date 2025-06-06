// components/sub-components/NewsCard.tsx - Updated to use header_image_url
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { Article } from "types";

type NewsCardProps = {
  article: Article;
  onPress: (article: Article) => void;
  formatDate: (dateString: string) => string;
};

const NewsCard = ({ article, onPress, formatDate }: NewsCardProps) => {
  return (
    <TouchableOpacity
      key={article.id}
      className="mb-6 bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm"
      onPress={() => onPress(article)}
    >
      {/* Render image if header_image_url exists */}
      {article.header_image_url && (
        <View className="h-48 w-full">
          <Image
            source={{ uri: article.header_image_url }}
            className="w-full h-full"
            resizeMode="contain"
            onError={(error) => {
              console.log("Image load error:", error.nativeEvent.error);
            }}
          />
        </View>
      )}

      <View className="p-4">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-gray-500 text-xs">
            {formatDate(article.created_at)}
          </Text>
        </View>

        <Text className="text-xl font-bold text-gray-800 mb-2">
          {article.title}
        </Text>

        <Text className="text-gray-600 mb-3" numberOfLines={2}>
          {article.body}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default NewsCard;
