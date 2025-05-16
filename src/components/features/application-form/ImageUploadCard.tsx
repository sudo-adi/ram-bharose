import React from 'react';
import { View, Text, TouchableOpacity, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

interface ImageUploadCardProps {
    onImageSelect: (image: ImagePicker.ImagePickerAsset) => void;
    selectedImage: ImagePicker.ImagePickerAsset | null;
    label?: string;
    error?: string;
}

const ImageUploadCard: React.FC<ImageUploadCardProps> = ({ onImageSelect, selectedImage, label = "Upload Image", error }) => {
    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert(
                'Permission needed',
                'Please grant camera roll permissions to upload images.'
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.8,
        });

        if (!result.canceled && result.assets && result.assets[0]) {
            onImageSelect(result.assets[0]);
        }
    };

    return (
        <View className="mb-4">
            <TouchableOpacity onPress={pickImage}>
                <View className={`h-32 w-full rounded-xl border-2 border-dashed ${error ? 'border-red-500' : 'border-gray-300'} justify-center items-center bg-gray-50 overflow-hidden`}>
                    {selectedImage ? (
                        <Image
                            source={{ uri: selectedImage.uri }}
                            className="w-full h-full"
                            resizeMode="cover"
                        />
                    ) : (
                        <>
                            <Ionicons name="add" size={32} color={error ? '#ef4444' : '#9ca3af'} />
                            <Text className={`text-xs mt-2 ${error ? 'text-red-500' : 'text-gray-500'}`}>{label}</Text>
                        </>
                    )}
                </View>
            </TouchableOpacity>
            {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
        </View>
    );
};

export default ImageUploadCard;