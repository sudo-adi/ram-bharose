import React from 'react';
import { View, Text, TextInput, KeyboardTypeOptions } from 'react-native';

interface FormFieldProps {
    label: string;
    placeholder: string;
    multiline?: boolean;
    keyboardType?: KeyboardTypeOptions;
    value: string;
    onChangeText: (text: string) => void;
    error?: string;
    secureTextEntry?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    placeholder,
    multiline = false,
    keyboardType = "default",
    value,
    onChangeText,
    error,
    secureTextEntry = false,
}) => {
    return (
        <View className="mb-4">
            <Text className="text-gray-700 mb-2">{label}</Text>
            <TextInput
                className={`border rounded-lg p-3 text-gray-800 bg-gray-50 ${error ? "border-red-500" : "border-gray-300"
                    }`}
                placeholder={placeholder}
                multiline={multiline}
                numberOfLines={multiline ? 4 : 1}
                style={multiline ? { height: 100, textAlignVertical: "top" } : {}}
                value={value}
                onChangeText={onChangeText}
                keyboardType={keyboardType}
                secureTextEntry={secureTextEntry}
            />
            {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
        </View>
    );
};

export default FormField;