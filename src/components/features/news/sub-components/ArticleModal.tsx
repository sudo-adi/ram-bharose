import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Article } from "types";


type ArticleModalProps = {
  article: Article | null;
  visible: boolean;
  onClose: () => void;
  formatDate: (dateString: string) => string;
};

const ArticleModal = ({
  article,
  visible,
  onClose,
  formatDate,
}: ArticleModalProps) => {
  if (!article) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1">
          {/* Modal Header with close button */}
          <View className="px-4 py-3 flex-row items-center justify-between border-b border-gray-100">
            <Text className="text-xl font-bold">Article</Text>
            <TouchableOpacity
              onPress={onClose}
              className="w-10 h-10 items-center justify-center rounded-full bg-gray-100"
            >
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            {/* Article Content */}
            <View className="p-4">
              <Text className="text-2xl font-bold text-gray-800 mb-2">
                {article.title}
              </Text>

              <View className="flex-row justify-between items-center mb-4">
                <View className="flex-row items-center">
                  <View className="w-8 h-8 bg-gray-200 rounded-full mr-2" />
                  {/* <Text className="text-gray-700">{article}</Text> */}
                </View>
                <Text className="text-gray-500 text-sm">
                  {formatDate(article.created_at)}
                </Text>
              </View>

              {/* Main Image - Only render if exists */}
              {article.image && (
                <Image
                  source={{ uri: article.image }}
                  className="w-full h-56 rounded-xl mb-4"
                  resizeMode="contain"
                  onError={(error) => {
                    console.log("Image load error:", error.nativeEvent.error);
                  }}
                />
              )}

              {/* Article Text */}
              <Text className="text-gray-800 leading-6 mb-6">
                {article.body}
              </Text>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default ArticleModal;
