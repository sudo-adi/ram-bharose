import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

type Person = {
  id: string;
  name: string;
  age: number;
  image?: string;
  phone?: string;
  gender?: string;
  birthDate?: string; // Assuming there's a birth date field
};

type BirthdaySectionProps = {
  todayBirthdays: Person[] | null;
  birthdaysLoading: boolean;
  onWishPress: (person: Person) => void;
  hasContactInfo: (person: Person) => boolean;
};

// Image placeholder utility
const getPlaceholderImage = (person: Person) => {
  const age = person.age;
  const gender = person.gender?.toLowerCase() || "";

  if (gender === "male") {
    if (age < 18) {
      return require("../../../../../assets/boy.png");
    } else {
      return require("../../../../../assets/man.png");
    }
  } else if (gender === "female") {
    if (age < 18) {
      return require("../../../../../assets/girl.png");
    } else {
      return require("../../../../../assets/women.png");
    }
  } else {
    return require("../../../../../assets/icon.png");
  }
};

const BirthdaySection = ({
  todayBirthdays,
  birthdaysLoading,
  onWishPress,
  hasContactInfo,
}: BirthdaySectionProps) => {
  const screenWidth = Dimensions.get("window").width;
  const router = useRouter();

  const handleGreetPress = (person: Person) => {
    if (hasContactInfo(person)) {
      onWishPress(person);
    } else {
      Alert.alert(
        "Contact Info Missing",
        `${person.name} has not updated their contact information yet.`,
        [{ text: "OK", style: "default" }]
      );
    }
  };

  // Handle card press - same behavior as greet button
  const handleCardPress = (person: Person) => {
    handleGreetPress(person);
  };

  // Sort birthdays by ascending age (youngest first)
  const sortedTodayBirthdays =
    todayBirthdays?.sort((a, b) => {
      return a.age - b.age;
    }) || [];

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center px-5 mb-3">
        <Text className="text-lg font-bold text-gray-800">
          Today's Birthdays 🎂
        </Text>
        <TouchableOpacity onPress={() => router.push("/birthdays")}>
          <Text className="text-orange-500 text-sm font-medium">View All</Text>
        </TouchableOpacity>
      </View>

      {birthdaysLoading ? (
        <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 items-center justify-center mx-5">
          <Text className="text-gray-800 font-medium text-center mt-2 mb-1">
            Loading birthdays...
          </Text>
        </View>
      ) : !sortedTodayBirthdays || sortedTodayBirthdays.length === 0 ? (
        <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 items-center justify-center mx-5">
          <Ionicons name="calendar-outline" size={32} color="#ff8c37" />
          <Text className="text-gray-800 font-medium text-center mt-2 mb-1">
            No Birthdays Today
          </Text>
          <Text className="text-gray-500 text-xs text-center">
            Check back tomorrow for more celebrations
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingLeft: 20, paddingRight: 10 }}
        >
          {sortedTodayBirthdays.map((person) => (
            <TouchableOpacity
              key={person.id}
              className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 mr-3"
              style={{
                width:
                  sortedTodayBirthdays.length === 1
                    ? screenWidth - 100 // Reduced from screenWidth - 80
                    : sortedTodayBirthdays.length <= 3
                    ? (screenWidth - 200) / 2 // Reduced from (screenWidth - 80) / 2
                    : 90, // Reduced from 100
              }}
              onPress={() => handleCardPress(person)}
            >
              <Image
                source={
                  person.image
                    ? { uri: person.image }
                    : getPlaceholderImage(person)
                }
                className="w-full"
                style={{
                  height:
                    sortedTodayBirthdays.length === 1
                      ? 75
                      : sortedTodayBirthdays.length <= 3
                      ? 80
                      : 50,
                }}
                resizeMode="cover"
              />
              <View className="p-2">
                <View className="flex-row items-center mb-0.5">
                  <Text className="text-orange-500 font-bold text-[10px] mr-1">
                    TODAY
                  </Text>
                </View>
                <Text
                  className="font-bold text-gray-800"
                  style={{
                    fontSize:
                      sortedTodayBirthdays.length === 1
                        ? 16
                        : sortedTodayBirthdays.length <= 3
                        ? 12
                        : 11,
                  }}
                  numberOfLines={1}
                >
                  {person.name}
                </Text>
                <Text
                  className="text-gray-500 mb-1.5"
                  style={{
                    fontSize:
                      sortedTodayBirthdays.length === 1
                        ? 12
                        : sortedTodayBirthdays.length <= 3
                        ? 10
                        : 9,
                  }}
                >
                  Turning {person.age} today
                </Text>
                <TouchableOpacity
                  onPress={() => handleGreetPress(person)}
                  className={`py-1 rounded-lg ${
                    hasContactInfo(person) ? "bg-orange-500" : "bg-gray-300"
                  }`}
                >
                  <Text
                    className="text-white font-medium text-center"
                    style={{
                      fontSize:
                        sortedTodayBirthdays.length === 1
                          ? 12
                          : sortedTodayBirthdays.length <= 3
                          ? 10
                          : 9,
                    }}
                  >
                    Greet 🎉
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default BirthdaySection;
