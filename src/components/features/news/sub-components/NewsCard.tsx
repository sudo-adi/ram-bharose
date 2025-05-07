import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

type NewsCardProps = {
  article: any;
  onPress: (article: any) => void;
  formatDate: (dateString: string) => string;
};

const NewsCard = ({ article, onPress, formatDate }: NewsCardProps) => {
  return (
    <TouchableOpacity
      key={article.id}
      className="mb-6 bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm"
      onPress={() => onPress(article)}
    >
      <Image
        source={{ uri: article.image }}
        className="w-full h-48"
        resizeMode="cover"
      />
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
        <View className="flex-row items-center">
          <View className="w-6 h-6 bg-gray-200 rounded-full mr-2" />
          <Text className="text-gray-700 text-sm">{article.userName}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default NewsCard;
