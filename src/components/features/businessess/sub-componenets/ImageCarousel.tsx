import React from "react";
import { View, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ImageCarouselProps = {
  images: string[];
  currentIndex: number;
  onNext: () => void;
  onPrev: () => void;
};

const ImageCarousel = ({
  images,
  currentIndex,
  onNext,
  onPrev,
}: ImageCarouselProps) => {
  if (!images || images.length === 0) return null;

  return (
    <View className="mb-6 relative">
      <Image
        source={{ uri: images[currentIndex] }}
        className="w-full h-56 rounded-xl"
        resizeMode="cover"
      />

      {/* Image Navigation */}
      <View className="flex-row justify-between absolute top-1/2 w-full px-2 -mt-5">
        <TouchableOpacity
          onPress={onPrev}
          className="bg-black/30 w-10 h-10 rounded-full items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onNext}
          className="bg-black/30 w-10 h-10 rounded-full items-center justify-center"
        >
          <Ionicons name="chevron-forward" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Image Indicators */}
      <View className="flex-row justify-center absolute bottom-2 w-full">
        {images.map((_, index) => (
          <View
            key={index}
            className={`w-2 h-2 rounded-full mx-1 ${
              index === currentIndex ? "bg-white" : "bg-white/50"
            }`}
          />
        ))}
      </View>
    </View>
  );
};

export default ImageCarousel;
