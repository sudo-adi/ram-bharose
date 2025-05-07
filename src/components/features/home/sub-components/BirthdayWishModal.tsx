import { View, Text, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

type Person = {
  id: string;
  name: string;
  age: number;
  image: string;
  phone?: string;
};

type BirthdayWishModalProps = {
  visible: boolean;
  onClose: () => void;
  selectedPerson: Person | null;
  onOptionSelect: (option: "whatsapp" | "sms" | "call") => void;
};

const BirthdayWishModal = ({
  visible,
  onClose,
  selectedPerson,
  onOptionSelect,
}: BirthdayWishModalProps) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl p-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">
              Send Birthday Wish
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {selectedPerson && (
            <Text className="text-gray-600 mb-4">
              Choose how you'd like to wish {selectedPerson.name} a happy
              birthday:
            </Text>
          )}

          <TouchableOpacity
            className="flex-row items-center p-4 bg-green-50 rounded-xl mb-3"
            onPress={() => onOptionSelect("whatsapp")}
          >
            <Ionicons name="logo-whatsapp" size={24} color="#25D366" />
            <Text className="ml-3 font-medium text-gray-800">WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center p-4 bg-blue-50 rounded-xl mb-3"
            onPress={() => onOptionSelect("sms")}
          >
            <Ionicons name="chatbubble-outline" size={24} color="#3B82F6" />
            <Text className="ml-3 font-medium text-gray-800">SMS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center p-4 bg-orange-50 rounded-xl"
            onPress={() => onOptionSelect("call")}
          >
            <Ionicons name="call-outline" size={24} color="#F97316" />
            <Text className="ml-3 font-medium text-gray-800">Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BirthdayWishModal;
