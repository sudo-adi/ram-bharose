import { View, ScrollView } from "react-native";
import NewsCard from "./NewsCard";
import CategoryFilter from "./CategoryFilter";
import React from "react";
import { Article } from "types";

type NewsListProps = {
  newsArticles: Article[];
  onArticlePress: (article: Article) => void;
  formatDate: (dateString: string) => string;
};

const NewsList = ({
  newsArticles,
  onArticlePress,
  formatDate,
}: NewsListProps) => {
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const categories = ["All", "Events", "Education", "Health", "Culture"];

  // Filter articles by category
  // You can implement actual filtering logic based on article content or add a category field to your database
  const filteredArticles = React.useMemo(() => {
    if (selectedCategory === "All") {
      return newsArticles;
    }

    // Example filtering logic - you can customize this based on your needs
    return newsArticles.filter((article) => {
      const articleText = (article.title + " " + article.body).toLowerCase();
      return articleText.includes(selectedCategory.toLowerCase());
    });
  }, [newsArticles, selectedCategory]);

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-5 py-4">
        {/* <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        /> */}

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
