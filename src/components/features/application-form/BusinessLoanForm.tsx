import React from 'react';
import { View, Text } from 'react-native'; // Added Text import
import ImageUploadCard from './ImageUploadCard'; // Added ImageUploadCard import
import FormField from './FormField';

interface BusinessLoanFormProps {
    formData: any;
    setFormData: (data: any) => void;
    errors: any;
    setErrors: (errors: any) => void;
}

const BusinessLoanForm: React.FC<BusinessLoanFormProps> = ({ formData, setFormData, errors, setErrors }) => {
    return (
        <View>
        </View>
    );
};

export default BusinessLoanForm;
