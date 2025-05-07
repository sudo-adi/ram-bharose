import { View, ScrollView } from "react-native";
import NewsCard from "./NewsCard";
import CategoryFilter from "./CategoryFilter";
import React from "react";

type NewsListProps = {
  newsArticles: any[];
  onArticlePress: (article: any) => void;
  formatDate: (dateString: string) => string;
};

const NewsList = ({
  newsArticles,
  onArticlePress,
  formatDate,
}: NewsListProps) => {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const categories = ["All", "Events", "Education", "Health", "Culture"];

  // Filter articles by category (this is a placeholder - implement actual filtering logic)
  const filteredArticles =
    selectedCategory === "All" ? newsArticles : newsArticles; // Replace with actual filtering logic

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-5 py-4">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {filteredArticles.map((article) => (
          <NewsCard
            key={article.id}
            article={article}
            onPress={onArticlePress}
            formatDate={formatDate}
          />
        ))}
      </View>
    </ScrollView>
  );
};

export default NewsList;
