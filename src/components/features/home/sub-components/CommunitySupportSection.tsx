import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";

type Cause = {
  title: string;
  description: string;
  progress: number;
  raised: string;
  goal: string;
  image: string;
  icon: string;
};

type CommunitySupportSectionProps = {
  onViewAll?: () => void;
};

const CommunitySupportSection = ({
  onViewAll,
}: CommunitySupportSectionProps) => {
  const causes = [
    {
      title: "Education for Rural Children",
      description:
        "Help provide education to underprivileged children in rural areas",
      progress: 65,
      raised: "₹32,500",
      goal: "₹50,000",
      image:
        "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=1000",
      icon: "book-education",
    },
    {
      title: "Women Empowerment Program",
      description: "Support skill development and entrepreneurship for women",
      progress: 40,
      raised: "₹30,000",
      goal: "₹75,000",
      image:
        "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=1000",
      icon: "account-group",
    },
    {
      title: "Clean Water Initiative",
      description: "Provide clean drinking water to remote villages",
      progress: 28,
      raised: "₹14,000",
      goal: "₹50,000",
      image:
        "https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1000",
      icon: "water",
    },
  ];

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center px-5 mb-3">
        <Text className="text-lg font-bold text-gray-800">
          Community Support 💛
        </Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text className="text-orange-500 text-sm font-medium">View All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingLeft: 20, paddingRight: 20 }}
      >
        {causes.map((cause, index) => (
          <TouchableOpacity
            key={index}
            className="bg-white rounded-xl overflow-hidden mr-3 shadow-sm w-64 border border-gray-100"
          >
            <Image
              source={{ uri: cause.image }}
              className="w-full h-32"
              resizeMode="cover"
            />
            <View className="absolute top-2 left-2 bg-white/90 p-1.5 rounded-lg">
              <MaterialCommunityIcons
                name={cause.icon as any}
                size={16}
                color="#ff8c37"
              />
            </View>

            <View className="p-3">
              <Text className="font-bold text-gray-800 text-xs">
                {cause.title}
              </Text>
              <Text className="text-gray-500 text-[10px] mt-0.5 mb-2">
                {cause.description}
              </Text>

              <View className="h-1.5 bg-gray-100 rounded-full mb-1.5">
                <View
                  className="h-1.5 rounded-full"
                  style={{
                    width: `${cause.progress}%`,
                    backgroundColor: "#ff8c37",
                  }}
                />
              </View>

              <View className="flex-row justify-between mb-3">
                <Text className="text-gray-500 text-[10px]">
                  {cause.progress}% of {cause.goal}
                </Text>
                <Text className="text-orange-500 text-[10px] font-medium">
                  {cause.raised} raised
                </Text>
              </View>

              <TouchableOpacity
                className="py-2 rounded-lg"
                style={{ backgroundColor: "#ff8c37" }}
              >
                <Text className="text-white font-medium text-center text-xs">
                  🙏 Donate Now
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default CommunitySupportSection;
